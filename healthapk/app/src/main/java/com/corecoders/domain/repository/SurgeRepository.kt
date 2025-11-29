package com.corecoders.domain.repository

import com.corecoders.data.model.SurgePredictionResponse
import com.corecoders.utils.Resource
import kotlinx.coroutines.flow.Flow

interface SurgeRepository {
    fun predictSurge(
        city: String,
        aqi: Double,
        pm25: Double,
        pm10: Double,
        temperature: Double,
        humidity: Double,
        rainfall: Double
    ): Flow<Resource<SurgePredictionResponse>>
}
