package com.kaankaplan.userService.business.concretes;

import com.kaankaplan.userService.business.abstracts.UserService;
import com.kaankaplan.userService.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userService.getUserByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException("Kullanıcı bulunamadı");
        }

        // Si claim es null, asignamos un rol por defecto
        String role = "ROLE_ADMIN";

        if (user.getClaim() != null && user.getClaim().getClaimName() != null) {
            role = "ROLE_" + user.getClaim().getClaimName();
        }
        System.out.println("Assigned role: " + role + " for user: " + email);
        System.out.println(
                "getClaim: " + (user.getClaim() != null ? user.getClaim().getClaimName() : "null"));

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role));

        return new org.springframework.security.core.userdetails.User(user.getEmail(),
                user.getPassword(), authorities);
    }


}
