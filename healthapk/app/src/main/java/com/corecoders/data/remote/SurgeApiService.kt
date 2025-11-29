package com.corecoders.data.remote

import com.corecoders.data.model.SurgePredictionResponse
import com.corecoders.data.model.SurgeRequest
import retrofit2.http.Body
import retrofit2.http.POST

interface SurgeApiService {
    @POST("api/predict-surge")
    suspend fun predictSurge(
        @Body request: SurgeRequest
    ): SurgePredictionResponse
}
