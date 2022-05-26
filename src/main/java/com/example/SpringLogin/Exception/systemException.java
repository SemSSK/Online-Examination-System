package com.example.SpringLogin.Exception;


public class systemException extends Exception {

    public enum ExceptionType {
        PRIVILEGE("you don't have the right privilege for this specific action ):"),
        ACCESS("sorry, you don't have access for this ):"),
        EXISTENCE("this already exist"),
        NOT_EXISTENCE("this doesn't exist");

        private String message;

        ExceptionType(String message){
            this.message = message;
        }
    }

    public systemException(String exceptionMessage){
        super(exceptionMessage);

    }
    public systemException(ExceptionType  exceptionType){
      super(exceptionType.message);
        System.out.println(exceptionType.message);
    }
}
