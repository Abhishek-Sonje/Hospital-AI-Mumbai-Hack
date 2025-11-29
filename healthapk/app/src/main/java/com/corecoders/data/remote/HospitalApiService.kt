package com.corecoders.data.remote

import com.corecoders.data.model.*
import retrofit2.http.*

interface HospitalApiService {
    @POST("api/recommend")
    suspend fun getHospitalRecommendations(
        @Body request: HospitalRequest
    ): HospitalRecommendationResponse
    
    @GET("api/hospitals")
    suspend fun getAllHospitals(
        @Query("speciality") speciality: String? = null
    ): HospitalListResponse
}

data class HospitalListResponse(
    val status: String,
    val hospitals: List<HospitalRecommendation>,
    val total: Int
)
