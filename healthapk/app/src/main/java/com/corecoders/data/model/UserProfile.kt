package com.corecoders.data.model

data class UserProfile(
    val userId: String = "",
    val name: String = "",
    val email: String = "",
    val age: Int = 0,
    val bloodGroup: String = "",
    val allergies: List<String> = emptyList(),
    val chronicDiseases: List<String> = emptyList(),
    val emergencyContact: String = "",
    val address: String = "",
    val city: String = "",
    val medicalHistory: List<MedicalRecord> = emptyList(),
    val createdAt: Long = System.currentTimeMillis()
)

data class MedicalRecord(
    val id: String = "",
    val disease: String = "",
    val diagnosedDate: Long = 0,
    val treatment: String = "",
    val notes: String = "",
    val medications: List<String> = emptyList()
)

data class AQIData(
    val aqi: Double = 0.0,
    val pm25: Double = 0.0,
    val pm10: Double = 0.0,
    val timestamp: Long = System.currentTimeMillis(),
    val location: String = ""
)
