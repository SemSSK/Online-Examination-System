package com.example.SpringLogin.Configrations.SecurityServices.AuthListners;


import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class LoginAttemptService {

    private final int MAX_ATTEMPT = 10;
    private final int EXPIRY_OF_CACHE_RECORD = 1; //Number of units in time needed to pass before removing cache record
    private final TimeUnit UNIT = TimeUnit.DAYS; // Unit of time used Can also be hours,minutes,seconds....
    private LoadingCache<String,Integer> attemptsCache;

    public LoginAttemptService(){
        super();
        attemptsCache = CacheBuilder.newBuilder()
                .expireAfterAccess(EXPIRY_OF_CACHE_RECORD, UNIT)
                .build(new CacheLoader<String, Integer>() {
                    @Override
                    public Integer load(String s) throws Exception {
                        return 0;
                    }
                });
    }

    public void loginSucceeded(String key){
        attemptsCache.invalidate(key);
    }

    public void loginFailed(String key){
        int attempts = 0;
        try{
            attempts = attemptsCache.get(key);
        }
        catch(ExecutionException e){ // catch Exception used if first login failure to create an new attempt for the new record
            attempts = 0;
        }
        attempts++;
        attemptsCache.put(key,attempts);
    }

    public boolean isBlocked(String key){
        try{
            return attemptsCache.get(key)>=MAX_ATTEMPT;
        }
        catch(ExecutionException e){ //Catch Exception needed for when there is no cache record for this key so the owner of the key is not blocked
                return false;
        }
    }
}
