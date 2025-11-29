package com.corecoders.presentation.aqi.viewmodel

import android.location.Location
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.corecoders.data.model.DiseasePrediction
import com.corecoders.data.model.ResourceSummary
import com.corecoders.data.model.UserProfile
import com.corecoders.domain.repository.SurgeRepository
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
class AQIViewModel @Inject constructor(
    private val surgeRepository: SurgeRepository,
    private val userRepository: UserRepository,
    private val aqiFetcher: AQIFetcher
) : ViewModel() {
    
    private val _uiState = MutableStateFlow<AQIUiState>(AQIUiState.Idle)
    val uiState: StateFlow<AQIUiState> = _uiState.asStateFlow()
    
    private val _aqiData = MutableStateFlow<AQIResult?>(null)
    val aqiData: StateFlow<AQIResult?> = _aqiData.asStateFlow()
    
    private val _userProfile = MutableStateFlow<UserProfile?>(null)
    val userProfile: StateFlow<UserProfile?> = _userProfile.asStateFlow()
    
    private val _personalizedAdvisories = MutableStateFlow<List<String>>(emptyList())
    val personalizedAdvisories: StateFlow<List<String>> = _personalizedAdvisories.asStateFlow()
    
    init {
        loadUserProfile()
    }
    
    private fun loadUserProfile() {
        viewModelScope.launch {
            val userId = userRepository.getCurrentUserId()
            if (userId != null) {
                userRepository.getUserProfile(userId).collect { resource ->
                    if (resource is Resource.Success) {
                        _userProfile.value = resource.data
                    }
                }
            }
        }
    }
    
    fun fetchAQIAndPredictions(location: Location, city: String = "Mumbai") {
        viewModelScope.launch {
            _uiState.value = AQIUiState.Loading
            
            // Fetch AQI data
            val aqiResult = aqiFetcher.fetchAQIData(location.latitude, location.longitude)
            if (aqiResult == null) {
                _uiState.value = AQIUiState.Error("Failed to fetch AQI data")
                return@launch
            }
            
            _aqiData.value = aqiResult
            
            // Predict surge
            surgeRepository.predictSurge(
                city = city,
                aqi = aqiResult.aqi,
                pm25 = aqiResult.pm25,
                pm10 = aqiResult.pm10,
                temperature = aqiResult.temperature,
                humidity = aqiResult.humidity,
                rainfall = aqiResult.rainfall
            ).collect { resource ->
                when (resource) {
                    is Resource.Loading -> _uiState.value = AQIUiState.Loading
                    is Resource.Success -> {
                        resource.data?.let { response ->
                            val personalizedAdvice = generatePersonalizedAdvisories(
                                aqiResult,
                                response.predictions,
                                _userProfile.value
                            )
                            _personalizedAdvisories.value = personalizedAdvice
                            
                            _uiState.value = AQIUiState.Success(
                                predictions = response.predictions,
                                summary = response.summary
                            )
                        }
                    }
                    is Resource.Error -> {
                        _uiState.value = AQIUiState.Error(resource.message ?: "Unknown error")
                    }
                }
            }
        }
    }
    
    private fun generatePersonalizedAdvisories(
        aqiData: AQIResult,
        predictions: List<DiseasePrediction>,
        userProfile: UserProfile?
    ): List<String> {
        val advisories = mutableListOf<String>()
        
        // Age-based advisories
        if (userProfile != null) {
            when {
                userProfile.age >= 60 -> {
                    advisories.add("Due to your age (${userProfile.age}), avoid outdoor activities when AQI is above 100")
                    if (aqiData.aqi > 150) {
                        advisories.add("Stay indoors and keep windows closed. Use air purifier if available")
                    }
                }
                userProfile.age <= 12 -> {
                    advisories.add("Children should avoid prolonged outdoor activities when AQI exceeds 100")
                }
            }
            
            // Chronic disease advisories
            if (userProfile.chronicDiseases.any { it.contains("Asthma", ignoreCase = true) || 
                it.contains("Respiratory", ignoreCase = true) }) {
                advisories.add("Keep your inhaler with you at all times")
                if (aqiData.aqi > 200) {
                    advisories.add("CRITICAL: Wear N95 mask if you must go outside")
                }
            }
            
            if (userProfile.chronicDiseases.any { it.contains("Heart", ignoreCase = true) }) {
                advisories.add("Limit physical exertion during high pollution days")
            }
            
            if (userProfile.chronicDiseases.any { it.contains("Diabetes", ignoreCase = true) }) {
                advisories.add("Monitor blood sugar more frequently during high pollution periods")
            }
        }
        
        // AQI level advisories
        when {
            aqiData.aqi > 300 -> {
                advisories.add("HAZARDOUS: Stay indoors, use air purifiers")
                advisories.add("Avoid all outdoor physical activities")
            }
            aqiData.aqi > 200 -> {
                advisories.add("VERY UNHEALTHY: Wear N95 masks outdoors")
                advisories.add("Limit outdoor exposure to less than 30 minutes")
            }
            aqiData.aqi > 150 -> {
                advisories.add("UNHEALTHY: Sensitive groups should stay indoors")
                advisories.add("Reduce prolonged outdoor exertion")
            }
            aqiData.aqi > 100 -> {
                advisories.add("MODERATE: Consider wearing mask for outdoor activities")
            }
        }
        
        // Disease surge warnings
        predictions.filter { it.surgeFlag }.forEach { disease ->
            advisories.add("WARNING: ${disease.disease} cases are surging. Take preventive measures")
        }
        
        return advisories.distinct()
    }
}

sealed class AQIUiState {
    object Idle : AQIUiState()
    object Loading : AQIUiState()
    data class Success(
        val predictions: List<DiseasePrediction>,
        val summary: ResourceSummary
    ) : AQIUiState()
    data class Error(val message: String) : AQIUiState()
}
