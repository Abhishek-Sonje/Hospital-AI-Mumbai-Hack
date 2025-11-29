package com.corecoders.presentation.ambulance.viewmodel

import android.location.Location
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.corecoders.data.model.HospitalRecommendation
import com.corecoders.domain.repository.HospitalRepository
import com.corecoders.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AmbulanceViewModel @Inject constructor(
    private val hospitalRepository: HospitalRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow<AmbulanceUiState>(AmbulanceUiState.Idle)
    val uiState: StateFlow<AmbulanceUiState> = _uiState.asStateFlow()
    
    private val _selectedHospital = MutableStateFlow<HospitalRecommendation?>(null)
    val selectedHospital: StateFlow<HospitalRecommendation?> = _selectedHospital.asStateFlow()
    
    fun bookUrgentAmbulance(location: Location, symptom: String) {
        viewModelScope.launch {
            hospitalRepository.getNearestHospital(
                latitude = location.latitude,
                longitude = location.longitude,
                symptom = symptom
            ).collect { resource ->
                when (resource) {
                    is Resource.Loading -> _uiState.value = AmbulanceUiState.Loading
                    is Resource.Success -> {
                        resource.data?.let {
                            _selectedHospital.value = it
                            _uiState.value = AmbulanceUiState.Success(listOf(it))
                        }
                    }
                    is Resource.Error -> {
                        _uiState.value = AmbulanceUiState.Error(resource.message ?: "Unknown error")
                    }
                }
            }
        }
    }
    
    fun searchHospitals(location: Location, symptom: String, severity: String? = null) {
        viewModelScope.launch {
            hospitalRepository.getHospitalRecommendations(
                latitude = location.latitude,
                longitude = location.longitude,
                symptom = symptom,
                severity = severity
            ).collect { resource ->
                when (resource) {
                    is Resource.Loading -> _uiState.value = AmbulanceUiState.Loading
                    is Resource.Success -> {
                        _uiState.value = AmbulanceUiState.Success(resource.data ?: emptyList())
                    }
                    is Resource.Error -> {
                        _uiState.value = AmbulanceUiState.Error(resource.message ?: "Unknown error")
                    }
                }
            }
        }
    }
    
    fun selectHospital(hospital: HospitalRecommendation) {
        _selectedHospital.value = hospital
    }
    
    fun clearSelection() {
        _selectedHospital.value = null
        _uiState.value = AmbulanceUiState.Idle
    }
}

sealed class AmbulanceUiState {
    object Idle : AmbulanceUiState()
    object Loading : AmbulanceUiState()
    data class Success(val hospitals: List<HospitalRecommendation>) : AmbulanceUiState()
    data class Error(val message: String) : AmbulanceUiState()
}
