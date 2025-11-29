package com.corecoders.utils

import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.URL

class AQIFetcher {
    
    suspend fun fetchAQIData(latitude: Double, longitude: Double): AQIResult? = withContext(Dispatchers.IO) {
        try {
            // Using OpenWeatherMap Air Pollution API (free tier)
            // User needs to add their API key
            val apiKey = "cd118d3268d26d0920de0b3e1fa6ec93"
            val url = "http://api.openweathermap.org/data/2.5/air_pollution?lat=$latitude&lon=$longitude&appid=$apiKey"
            
            val response = URL(url).readText()
            val json = JSONObject(response)
            
            val list = json.getJSONArray("list").getJSONObject(0)
            val components = list.getJSONObject("components")
            
            // Weather data would come from another API call
            AQIResult(
                aqi = list.getJSONObject("main").getInt("aqi").toDouble() * 50,
                pm25 = components.getDouble("pm2_5"),
                pm10 = components.getDouble("pm10"),
                temperature = 28.0, // Placeholder - need weather API
                humidity = 65.0, // Placeholder - need weather API
                rainfall = 0.0 // Placeholder - need weather API
            )
        } catch (e: Exception) {
            Log.e("AQIFetcher", "Error fetching AQI data", e)
            // Return demo data for testing
            AQIResult(
                aqi = 150.0,
                pm25 = 75.0,
                pm10 = 100.0,
                temperature = 28.0,
                humidity = 65.0,
                rainfall = 0.0
            )
        }
    }
}

data class AQIResult(
    val aqi: Double,
    val pm25: Double,
    val pm10: Double,
    val temperature: Double,
    val humidity: Double,
    val rainfall: Double
)
