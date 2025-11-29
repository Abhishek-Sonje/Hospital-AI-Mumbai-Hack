package com.corecoders.di

import android.content.Context
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.FirebaseDatabase
import com.corecoders.data.remote.HospitalApiService
import com.corecoders.data.remote.SurgeApiService
import com.corecoders.data.repository.HospitalRepositoryImpl
import com.corecoders.data.repository.SurgeRepositoryImpl
import com.corecoders.data.repository.UserRepositoryImpl
import com.corecoders.domain.repository.HospitalRepository
import com.corecoders.domain.repository.SurgeRepository
import com.corecoders.domain.repository.UserRepository
import com.corecoders.utils.AQIFetcher
import com.corecoders.utils.LocationHelper
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Named
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    
    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            })
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()
    }
    
    @Provides
    @Singleton
    @Named("hospital")
    fun provideHospitalRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://hospital-recomm.onrender.com/")
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    
    @Provides
    @Singleton
    @Named("surge")
    fun provideSurgeRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api-surge.onrender.com/")
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    
    @Provides
    @Singleton
    fun provideHospitalApiService(@Named("hospital") retrofit: Retrofit): HospitalApiService {
        return retrofit.create(HospitalApiService::class.java)
    }
    
    @Provides
    @Singleton
    fun provideSurgeApiService(@Named("surge") retrofit: Retrofit): SurgeApiService {
        return retrofit.create(SurgeApiService::class.java)
    }
    
    @Provides
    @Singleton
    fun provideFirebaseAuth(): FirebaseAuth = FirebaseAuth.getInstance()
    
    @Provides
    @Singleton
    fun provideFirebaseDatabase(): FirebaseDatabase = FirebaseDatabase.getInstance()
    
    @Provides
    @Singleton
    fun provideHospitalRepository(apiService: HospitalApiService): HospitalRepository {
        return HospitalRepositoryImpl(apiService)
    }
    
    @Provides
    @Singleton
    fun provideSurgeRepository(apiService: SurgeApiService): SurgeRepository {
        return SurgeRepositoryImpl(apiService)
    }
    
    @Provides
    @Singleton
    fun provideUserRepository(
        auth: FirebaseAuth,
        database: FirebaseDatabase
    ): UserRepository {
        return UserRepositoryImpl(auth, database)
    }
    
    @Provides
    @Singleton
    fun provideLocationHelper(@ApplicationContext context: Context): LocationHelper {
        return LocationHelper(context)
    }
    
    @Provides
    @Singleton
    fun provideAQIFetcher(): AQIFetcher {
        return AQIFetcher()
    }
}
