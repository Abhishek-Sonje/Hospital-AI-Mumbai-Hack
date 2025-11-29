package com.corecoders.data.model

import com.google.gson.annotations.SerializedName

data class HospitalRecommendationResponse(
    val status: String,
    val query: QueryInfo,
    val recommendations: List<HospitalRecommendation>,
    @SerializedName("total_results")
    val totalResults: Int
)

data class QueryInfo(
    @SerializedName("user_lat")
    val userLat: Double,
    @SerializedName("user_lng")
    val userLng: Double,
    val symptom: String,
    @SerializedName("inferred_severity")
    val inferredSeverity: String,
    @SerializedName("emergency_level")
    val emergencyLevel: String,
    @SerializedName("required_speciality")
    val requiredSpeciality: String
)

data class HospitalRecommendation(
    @SerializedName("hospital_name")
    val hospitalName: String,
    val speciality: String,
    @SerializedName("hospital_lat")
    val hospitalLat: Double,
    @SerializedName("hospital_lng")
    val hospitalLng: Double,
    @SerializedName("distance_km")
    val distanceKm: Double,
    @SerializedName("predicted_waiting_time_min")
    val predictedWaitingTimeMin: Double,
    @SerializedName("available_general_beds")
    val availableGeneralBeds: Int,
    @SerializedName("available_icu_beds")
    val availableIcuBeds: Int,
    @SerializedName("available_ventilators")
    val availableVentilators: Int,
    @SerializedName("traffic_level")
    val trafficLevel: String,
    @SerializedName("ml_score")
    val mlScore: Double,
    @SerializedName("recommended_ambulance_type")
    val recommendedAmbulanceType: String,
    @SerializedName("dataset_ambulance_hint")
    val datasetAmbulanceHint: String
)

data class HospitalRequest(
    @SerializedName("user_lat")
    val userLat: Double,
    @SerializedName("user_lng")
    val userLng: Double,
    val symptom: String,
    val severity: String? = null,
    @SerializedName("emergency_level")
    val emergencyLevel: String? = null,
    @SerializedName("top_k")
    val topK: Int = 5
)
