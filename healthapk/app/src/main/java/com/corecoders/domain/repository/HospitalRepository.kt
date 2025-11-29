package com.corecoders.domain.repository

import com.corecoders.data.model.HospitalRecommendation
import com.corecoders.utils.Resource
import kotlinx.coroutines.flow.Flow

interface HospitalRepository {
    fun getHospitalRecommendations(
        latitude: Double,
        longitude: Double,
        symptom: String,
        severity: String? = null
    ): Flow<Resource<List<HospitalRecommendation>>>
    
    fun getNearestHospital(
        latitude: Double,
        longitude: Double,
        symptom: String
    ): Flow<Resource<HospitalRecommendation>>
}
