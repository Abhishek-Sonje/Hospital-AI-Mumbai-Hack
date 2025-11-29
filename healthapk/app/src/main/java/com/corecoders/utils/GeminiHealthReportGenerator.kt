package com.corecoders.utils

import android.content.Context
import com.corecoders.data.model.UserProfile
import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.BlockThreshold
import com.google.ai.client.generativeai.type.HarmCategory
import com.google.ai.client.generativeai.type.SafetySetting
import com.google.ai.client.generativeai.type.generationConfig
import java.text.SimpleDateFormat
import java.util.*

object GeminiHealthReportGenerator {

    // TODO: Replace with your actual Gemini API key
    // Get it from: https://makersuite.google.com/app/apikey
    private const val GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"

    /**
     * Generate comprehensive health report using Google Gemini AI
     */
    suspend fun generateComprehensiveReport(
        profile: UserProfile,
        aqiData: AQIResult?,
        context: Context
    ): String {

        // Initialize Gemini model
        val generativeModel = GenerativeModel(
            modelName = "gemini-1.5-flash",
            apiKey = GEMINI_API_KEY,
            generationConfig = generationConfig {
                temperature = 0.7f
                topK = 40
                topP = 0.95f
                maxOutputTokens = 2048
            },
            safetySettings = listOf(
                SafetySetting(HarmCategory.HARASSMENT, BlockThreshold.MEDIUM_AND_ABOVE),
                SafetySetting(HarmCategory.HATE_SPEECH, BlockThreshold.MEDIUM_AND_ABOVE),
                SafetySetting(HarmCategory.SEXUALLY_EXPLICIT, BlockThreshold.MEDIUM_AND_ABOVE),
                SafetySetting(HarmCategory.DANGEROUS_CONTENT, BlockThreshold.MEDIUM_AND_ABOVE),
            )
        )

        // Build comprehensive prompt
        val prompt = buildHealthReportPrompt(profile, aqiData)

        // Generate content
        val response = generativeModel.generateContent(prompt)

        return response.text ?: "Unable to generate report. Please try again."
    }

    /**
     * Build detailed prompt for Gemini AI
     */
    private fun buildHealthReportPrompt(profile: UserProfile, aqiData: AQIResult?): String {
        val dateFormat = SimpleDateFormat("MMMM dd, yyyy", Locale.getDefault())
        val currentDate = dateFormat.format(Date())

        return """
            You are a professional medical AI assistant. Generate a comprehensive, personalized health report for the following patient.
            
            **PATIENT INFORMATION:**
            - Name: ${profile.name}
            - Age: ${profile.age} years old
            - Blood Group: ${profile.bloodGroup}
            - Location: ${profile.city}
            - Emergency Contact: ${profile.emergencyContact}
            
            **CHRONIC CONDITIONS:**
            ${if (profile.chronicDiseases.isNotEmpty()) {
            profile.chronicDiseases.joinToString("\n") { "- $it" }
        } else {
            "- None reported"
        }}
            
            **KNOWN ALLERGIES:**
            ${if (profile.allergies.isNotEmpty()) {
            profile.allergies.joinToString("\n") { "- $it" }
        } else {
            "- None reported"
        }}
            
            **MEDICAL HISTORY:**
            ${if (profile.medicalHistory.isNotEmpty()) {
            profile.medicalHistory.sortedByDescending { it.diagnosedDate }.take(5).joinToString("\n\n") { record ->
                """
                    • ${record.disease} (${SimpleDateFormat("MMM yyyy", Locale.getDefault()).format(Date(record.diagnosedDate))})
                      Treatment: ${record.treatment.ifBlank { "Not specified" }}
                      Medications: ${record.medications.joinToString(", ").ifBlank { "None" }}
                      ${if (record.notes.isNotBlank()) "Notes: ${record.notes}" else ""}
                    """.trimIndent()
            }
        } else {
            "- No previous medical records"
        }}
            
            **CURRENT ENVIRONMENTAL CONDITIONS:**
            ${if (aqiData != null) {
            """
                - Air Quality Index (AQI): ${aqiData.aqi.toInt()} - ${getAQICategory(aqiData.aqi)}
                - PM2.5: ${aqiData.pm25.toInt()} µg/m³
                - PM10: ${aqiData.pm10.toInt()} µg/m³
                - Temperature: ${aqiData.temperature.toInt()}°C
                - Humidity: ${aqiData.humidity.toInt()}%
                - Rainfall: ${aqiData.rainfall.toInt()} mm
                """.trimIndent()
        } else {
            "- Environmental data not available"
        }}
            
            **INSTRUCTIONS:**
            Generate a comprehensive health report with the following sections:
            
            1. **EXECUTIVE SUMMARY**
               - Overall health assessment
               - Key concerns based on age, conditions, and environment
               
            2. **CHRONIC CONDITION MANAGEMENT**
               - Analysis of each chronic condition
               - Management recommendations
               - Medication adherence tips
               
            3. **ENVIRONMENTAL HEALTH IMPACT**
               - How current AQI levels affect this patient
               - Specific precautions based on chronic conditions
               - Air quality-related health risks
               
            4. **AGE-SPECIFIC RECOMMENDATIONS**
               - Health screenings recommended for age ${profile.age}
               - Preventive care measures
               - Lifestyle modifications
               
            5. **PERSONALIZED HEALTH TIPS**
               - Diet recommendations (considering allergies and conditions)
               - Exercise guidelines (age and condition appropriate)
               - Daily health practices
               
            6. **WARNING SIGNS & WHEN TO SEEK HELP**
               - Red flags for each chronic condition
               - Emergency symptoms to watch for
               - When to contact healthcare provider
               
            7. **PREVENTIVE MEASURES**
               - Vaccinations recommended
               - Regular health check-ups needed
               - Disease prevention strategies
               
            8. **MEDICATION REVIEW** (if applicable)
               - Current medications analysis
               - Potential interactions to watch for
               - Adherence tips
               
            9. **MENTAL HEALTH & WELLBEING**
               - Stress management techniques
               - Mental health considerations
               - Support resources
               
            10. **ACTION PLAN**
                - Immediate action items (next 30 days)
                - Short-term goals (3-6 months)
                - Long-term health objectives
            
            **FORMATTING GUIDELINES:**
            - Use clear, professional medical language
            - Be empathetic and encouraging
            - Provide specific, actionable advice
            - Include relevant statistics when helpful
            - Avoid alarming language while being honest
            - Use bullet points for clarity
            - Keep recommendations practical and achievable
            
            **IMPORTANT DISCLAIMERS TO INCLUDE:**
            - This is an AI-generated report for informational purposes
            - Not a substitute for professional medical advice
            - Consult healthcare provider before making health decisions
            - In case of emergency, call local emergency services
            
            Report Date: $currentDate
            
            Generate the report now:
        """.trimIndent()
    }

    /**
     * Get AQI category description
     */
    private fun getAQICategory(aqi: Double): String {
        return when {
            aqi <= 50 -> "Good"
            aqi <= 100 -> "Moderate"
            aqi <= 150 -> "Unhealthy for Sensitive Groups"
            aqi <= 200 -> "Unhealthy"
            aqi <= 300 -> "Very Unhealthy"
            else -> "Hazardous"
        }
    }

    /**
     * Generate quick health summary (shorter version)
     */
    suspend fun generateQuickSummary(
        profile: UserProfile,
        aqiData: AQIResult?
    ): String {
        val generativeModel = GenerativeModel(
            modelName = "gemini-1.5-flash",
            apiKey = GEMINI_API_KEY,
            generationConfig = generationConfig {
                temperature = 0.7f
                maxOutputTokens = 512
            }
        )

        val prompt = """
            Generate a brief health summary (max 200 words) for:
            Age: ${profile.age}, Conditions: ${profile.chronicDiseases.joinToString()}, 
            Current AQI: ${aqiData?.aqi?.toInt() ?: "Unknown"}
            
            Focus on:
            - Current health status
            - Top 3 immediate recommendations
            - Environmental precautions if AQI is high
        """.trimIndent()

        val response = generativeModel.generateContent(prompt)
        return response.text ?: "Unable to generate summary"
    }

    /**
     * Generate personalized advice for specific condition
     */
    suspend fun generateConditionAdvice(
        condition: String,
        age: Int,
        currentAQI: Double?
    ): String {
        val generativeModel = GenerativeModel(
            modelName = "gemini-1.5-flash",
            apiKey = GEMINI_API_KEY,
            generationConfig = generationConfig {
                temperature = 0.7f
                maxOutputTokens = 1024
            }
        )

        val prompt = """
            Provide personalized health advice for a ${age}-year-old patient with $condition.
            ${if (currentAQI != null) "Current AQI: ${currentAQI.toInt()}" else ""}
            
            Include:
            1. Daily management tips
            2. Warning signs to watch for
            3. Lifestyle modifications
            4. ${if (currentAQI != null && currentAQI > 100) "Special precautions for high AQI" else "General precautions"}
            
            Keep it concise and actionable.
        """.trimIndent()

        val response = generativeModel.generateContent(prompt)
        return response.text ?: "Unable to generate advice"
    }

    /**
     * Generate emergency preparedness plan
     */
    suspend fun generateEmergencyPlan(profile: UserProfile): String {
        val generativeModel = GenerativeModel(
            modelName = "gemini-1.5-flash",
            apiKey = GEMINI_API_KEY,
            generationConfig = generationConfig {
                temperature = 0.7f
                maxOutputTokens = 1024
            }
        )

        val prompt = """
            Create a personalized emergency preparedness plan for:
            Age: ${profile.age}
            Chronic Conditions: ${profile.chronicDiseases.joinToString()}
            Allergies: ${profile.allergies.joinToString()}
            
            Include:
            1. Emergency contact list template
            2. Medical information card content
            3. Emergency kit essentials (condition-specific)
            4. Steps to take during medical emergency
            5. Important documents to keep ready
            6. Communication plan
            
            Make it practical and easy to follow.
        """.trimIndent()

        val response = generativeModel.generateContent(prompt)
        return response.text ?: "Unable to generate emergency plan"
    }

    /**
     * Validate API key configuration
     */
    fun isApiKeyConfigured(): Boolean {
        return GEMINI_API_KEY != "YOUR_GEMINI_API_KEY" && GEMINI_API_KEY.isNotBlank()
    }
}