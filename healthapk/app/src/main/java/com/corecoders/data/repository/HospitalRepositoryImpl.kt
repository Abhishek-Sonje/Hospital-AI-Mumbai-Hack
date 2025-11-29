package com.corecoders.data.repository

import com.corecoders.data.model.HospitalRecommendation
import com.corecoders.data.model.HospitalRequest
import com.corecoders.data.remote.HospitalApiService
import com.corecoders.domain.repository.HospitalRepository
import com.corecoders.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

class HospitalRepositoryImpl @Inject constructor(
    private val apiService: HospitalApiService
) : HospitalRepository {
    
    override fun getHospitalRecommendations(
        latitude: Double,
        longitude: Double,
        symptom: String,
        severity: String?
    ): Flow<Resource<List<HospitalRecommendation>>> = flow {
        try {
            emit(Resource.Loading())
            val request = HospitalRequest(
                userLat = latitude,
                userLng = longitude,
                symptom = symptom,
                severity = severity,
                topK = 5
            )
            val response = apiService.getHospitalRecommendations(request)
            emit(Resource.Success(response.recommendations))
        } catch (e: Exception) {
            emit(Resource.Error(e.message ?: "Unknown error occurred"))
        }
    }
    
    override fun getNearestHospital(
        latitude: Double,
        longitude: Double,
        symptom: String
    ): Flow<Resource<HospitalRecommendation>> = flow {
        try {
            emit(Resource.Loading())
            val request = HospitalRequest(
                userLat = latitude,
                userLng = longitude,
                symptom = symptom,
                topK = 1
            )
            val response = apiService.getHospitalRecommendations(request)
            if (response.recommendations.isNotEmpty()) {
                emit(Resource.Success(response.recommendations.first()))
            } else {
                emit(Resource.Error("No hospitals found"))
            }
        } catch (e: Exception) {
            emit(Resource.Error(e.message ?: "Unknown error occurred"))
        }
    }
}
