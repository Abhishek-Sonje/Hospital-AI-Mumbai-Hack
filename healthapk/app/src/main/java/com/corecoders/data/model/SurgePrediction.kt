package com.corecoders.data.model

import com.google.gson.annotations.SerializedName

data class SurgePredictionResponse(
    val status: String,
    val predictions: List<DiseasePrediction>,
    val summary: ResourceSummary,
    @SerializedName("input_params")
    val inputParams: InputParams
)

data class DiseasePrediction(
    @SerializedName("Disease")
    val disease: String,
    @SerializedName("Predicted_Cases")
    val predictedCases: Double,
    @SerializedName("Baseline_Median")
    val baselineMedian: Double,
    @SerializedName("Surge_Threshold")
    val surgeThreshold: Double,
    @SerializedName("Is_Surge")
    val isSurge: String,
    @SerializedName("Surge_Flag")
    val surgeFlag: Boolean,
    @SerializedName("Beds_Needed")
    val bedsNeeded: Int,
    @SerializedName("Oxygen_Units")
    val oxygenUnits: Int,
    @SerializedName("Ventilators")
    val ventilators: Int,
    @SerializedName("Staff_Required")
    val staffRequired: Int
)

data class ResourceSummary(
    @SerializedName("Total_Beds")
    val totalBeds: Int,
    @SerializedName("Total_Oxygen_Units")
    val totalOxygenUnits: Int,
    @SerializedName("Total_Ventilators")
    val totalVentilators: Int,
    @SerializedName("Total_Staff_Required")
    val totalStaffRequired: Int,
    @SerializedName("Advisories")
    val advisories: List<String>,
    @SerializedName("Total_Surges_Detected")
    val totalSurgesDetected: Int,
    @SerializedName("Risk_Level")
    val riskLevel: String
)

data class InputParams(
    val city: String,
    val aqi: Double,
    val pm25: Double,
    val pm10: Double,
    val temperature: Double,
    val humidity: Double,
    val rainfall: Double,
    val season: String,
    val festival: String,
    @SerializedName("day_type")
    val dayType: String
)

data class SurgeRequest(
    val city: String,
    val aqi: Double,
    val pm25: Double,
    val pm10: Double,
    val temperature: Double,
    val humidity: Double,
    val rainfall: Double,
    val season: String,
    val festival: String = "None",
    @SerializedName("day_type")
    val dayType: String = "Weekday",
    @SerializedName("city_population")
    val cityPopulation: Int = 1000000
)
