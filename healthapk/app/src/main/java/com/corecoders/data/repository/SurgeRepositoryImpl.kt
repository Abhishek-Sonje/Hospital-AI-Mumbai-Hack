package com.corecoders.data.repository

import com.corecoders.data.model.SurgePredictionResponse
import com.corecoders.data.model.SurgeRequest
import com.corecoders.data.remote.SurgeApiService
import com.corecoders.domain.repository.SurgeRepository
import com.corecoders.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

class SurgeRepositoryImpl @Inject constructor(
    private val apiService: SurgeApiService
) : SurgeRepository {
    
    override fun predictSurge(
        city: String,
        aqi: Double,
        pm25: Double,
        pm10: Double,
        temperature: Double,
        humidity: Double,
        rainfall: Double
    ): Flow<Resource<SurgePredictionResponse>> = flow {
        try {
            emit(Resource.Loading())
            val request = SurgeRequest(
                city = city,
                aqi = aqi,
                pm25 = pm25,
                pm10 = pm10,
                temperature = temperature,
                humidity = humidity,
                rainfall = rainfall,
                season = getCurrentSeason(),
                dayType = getCurrentDayType()
            )
            val response = apiService.predictSurge(request)
            emit(Resource.Success(response))
        } catch (e: Exception) {
            emit(Resource.Error(e.message ?: "Unknown error occurred"))
        }
    }
    
    private fun getCurrentSeason(): String {
        val month = java.util.Calendar.getInstance().get(java.util.Calendar.MONTH)
        return when (month) {
            0, 1, 11 -> "Winter"
            2, 3, 4 -> "Spring"
            5, 6, 7 -> "Summer"
            8, 9, 10 -> "Autumn"
            else -> "Spring"
        }
    }
    
    private fun getCurrentDayType(): String {
        val dayOfWeek = java.util.Calendar.getInstance().get(java.util.Calendar.DAY_OF_WEEK)
        return when (dayOfWeek) {
            java.util.Calendar.SATURDAY, java.util.Calendar.SUNDAY -> "Weekend"
            else -> "Weekday"
        }
    }
}
