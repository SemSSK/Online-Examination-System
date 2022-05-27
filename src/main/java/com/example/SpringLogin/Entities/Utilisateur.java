package com.example.SpringLogin.Entities;

import com.example.SpringLogin.DataEncryption.StringCryptoConverter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public class Utilisateur implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long userId;

    @Column(nullable = false,unique = true)
    @Convert(converter = StringCryptoConverter.class)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Column(nullable = false)
    @Convert(converter = StringCryptoConverter.class)
    private String name;

    @Column(nullable = false)
    @Convert(converter = StringCryptoConverter.class)
    private String lastName;

    @Column(nullable = false)
    @Convert(converter = StringCryptoConverter.class)
    private String userRole;

    @Column(unique = true)
    @Convert(converter = StringCryptoConverter.class)
    private String urlProfile;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = true,name = "admin_id")
    @JsonIgnore
    private Administrateur admin;


    @Override
    public boolean equals(Object obj)
    {
        if(obj == this){
            return true;
        }

        if(!(obj instanceof Utilisateur)){
            return false;
        }

        Utilisateur user = (Utilisateur) obj;

        return this.userId.equals(user.userId);
    }

    @Override
    public int hashCode() {
        return userId.hashCode();
    }
}
