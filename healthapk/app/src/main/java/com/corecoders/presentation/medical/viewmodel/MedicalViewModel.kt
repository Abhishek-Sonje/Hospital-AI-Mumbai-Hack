package com.corecoders.presentation.medical.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.corecoders.data.model.MedicalRecord
import com.corecoders.data.model.UserProfile
import com.corecoders.domain.repository.UserRepository
import com.corecoders.utils.AQIFetcher
import com.corecoders.utils.AQIResult
import com.corecoders.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MedicalViewModel @Inject constructor(
    private val userRepository: UserRepository,
    private val aqiFetcher: AQIFetcher
) : ViewModel() {

    private val _uiState = MutableStateFlow<MedicalUiState>(MedicalUiState.Loading)
    val uiState: StateFlow<MedicalUiState> = _uiState.asStateFlow()

    private val _userProfile = MutableStateFlow<UserProfile?>(null)
    val userProfile: StateFlow<UserProfile?> = _userProfile.asStateFlow()

    private val _aqiData = MutableStateFlow<AQIResult?>(null)
    val aqiData: StateFlow<AQIResult?> = _aqiData.asStateFlow()

    init {
        loadUserProfile()
        fetchAQIData()
    }

    private fun loadUserProfile() {
        viewModelScope.launch {
            val userId = userRepository.getCurrentUserId()
            if (userId == null) {
                _uiState.value = MedicalUiState.Error("User not logged in")
                return@launch
            }

            userRepository.getUserProfile(userId).collect { resource ->
                when (resource) {
                    is Resource.Loading -> _uiState.value = MedicalUiState.Loading
                    is Resource.Success -> {
                        _userProfile.value = resource.data
                        _uiState.value = MedicalUiState.Success(resource.data!!)
                    }
                    is Resource.Error -> {
                        _uiState.value = MedicalUiState.Error(resource.message ?: "Unknown error")
                    }
                }
            }
        }
    }

    private fun fetchAQIData() {
        viewModelScope.launch {
            try {
                // Default to Mumbai coordinates, or get from user profile
                val latitude = 19.0760
                val longitude = 72.8777
                val data = aqiFetcher.fetchAQIData(latitude, longitude)
                _aqiData.value = data
            } catch (e: Exception) {
                // AQI data is optional, continue without it
                _aqiData.value = null
            }
        }
    }

    fun addMedicalRecord(record: MedicalRecord) {
        viewModelScope.launch {
            val currentProfile = _userProfile.value ?: return@launch
            val updatedHistory = currentProfile.medicalHistory + record
            val updatedProfile = currentProfile.copy(medicalHistory = updatedHistory)

            userRepository.updateUserProfile(updatedProfile).collect { resource ->
                if (resource is Resource.Success) {
                    _userProfile.value = updatedProfile
                    _uiState.value = MedicalUiState.Success(updatedProfile)
                }
            }
        }
    }

    fun updateProfile(updatedProfile: UserProfile) {
        viewModelScope.launch {
            userRepository.updateUserProfile(updatedProfile).collect { resource ->
                when (resource) {
                    is Resource.Loading -> _uiState.value = MedicalUiState.Loading
                    is Resource.Success -> {
                        _userProfile.value = updatedProfile
                        _uiState.value = MedicalUiState.Success(updatedProfile)
                    }
                    is Resource.Error -> {
                        _uiState.value = MedicalUiState.Error(resource.message ?: "Failed to update")
                    }
                }
            }
        }
    }

    fun refreshAQIData() {
        fetchAQIData()
    }
}

sealed class MedicalUiState {
    object Loading : MedicalUiState()
    data class Success(val profile: UserProfile) : MedicalUiState()
    data class Error(val message: String) : MedicalUiState()
}