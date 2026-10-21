package com.cesmac.apidadosrpg.Dados.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

@Service
public class RolagemService {
    private final Random random = new Random();

    public List<Integer> gerarAtributos() {
        List<Integer> valores = new ArrayList<>();

        for (int i = 0; i < 6; i++) {
            valores.add(rolarAtributo());
        }

        // Ordena do maior para o menor
        valores.sort(Collections.reverseOrder());

        return valores;
    }

    public int rolarAtributo() {
        List<Integer> rolagens = new ArrayList<>();

        for (int i = 1; i <= 4; i++) {
            rolagens.add(random.nextInt(6) + 1);
        }

        Collections.sort(rolagens);

        // Descarta o menor (índice 0) e soma os 3 maiores
        return rolagens.get(1) + rolagens.get(2) + rolagens.get(3);
    }
}