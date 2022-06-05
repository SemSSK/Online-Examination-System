package com.example.SpringLogin.Configrations.SecurityServices;


import com.example.SpringLogin.utilities.RandomStringGenerator;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.keygen.Base64StringKeyGenerator;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class ActivationCodeService {

    private HashMap<String,ActivationCode> codesMap;

    public ActivationCodeService(){
        codesMap = new HashMap<>();
        System.out.println("ActivationCodeService instatiated");
    }

    public void MakeActivationCode(String email){
        String code =  RandomStringGenerator.getNumericString(6);
        System.out.println(code);
        ActivationCode activationCode = new ActivationCode(code);
        codesMap.put(email,activationCode);
    }

    private ActivationCode getCode(String email){
        return codesMap.get(email);
    }

    public boolean treatCode(String email,String enteredcode){
        ActivationCode code = getCode(email);
        boolean validTrial = code.incrementAttempts();
        boolean codeIsCorrect = (code.isValid()
                && code.getCode().equals(enteredcode));

        if(!validTrial && !codeIsCorrect){
            codesMap.remove(email);
            SecurityContextHolder.clearContext();
        }

        return codeIsCorrect;
    }



}
