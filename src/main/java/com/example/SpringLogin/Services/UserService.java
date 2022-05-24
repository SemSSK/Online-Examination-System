package com.example.SpringLogin.Services;

import com.example.SpringLogin.Entities.Utilisateur;
import com.example.SpringLogin.Repos.UtilisateurRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

@Service
@Transactional
public class UserService {
    @Autowired
    private UtilisateurRepo utilisateurRepo;

    public Utilisateur findUserByEmail(String email){
        return utilisateurRepo.findByEmail(email);
    }


    public static final int MAX_FAILED_ATTEMPTS = 3;

    private static final long LOCK_TIME_DURATION = 24 * 60 * 60 * 1000; // 24 hours


    public void increaseFailedAttempts(Utilisateur user) {
        int newFailAttempts = user.getFailedAttempt() + 1;
        utilisateurRepo.updateFailedAttempts(newFailAttempts, user.getEmail());
    }

    public void resetFailedAttempts(String email) {
        utilisateurRepo.updateFailedAttempts(0, email);
    }

    public void lock(Utilisateur user) {
        user.setAccountNonLocked(false);
        user.setLockTime(new Date());

        utilisateurRepo.save(user);
    }

    public boolean unlockWhenTimeExpired(Utilisateur user) {
        long lockTimeInMillis = user.getLockTime().getTime();
        long currentTimeInMillis = System.currentTimeMillis();

        if (lockTimeInMillis + LOCK_TIME_DURATION < currentTimeInMillis) {
            user.setAccountNonLocked(true);
            user.setLockTime(null);
            user.setFailedAttempt(0);

            utilisateurRepo.save(user);

            return true;
        }

        return false;
    }
}
