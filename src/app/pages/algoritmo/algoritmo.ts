import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-algoritmo',
  imports: [],
  templateUrl: './algoritmo.html',
  styleUrl: './algoritmo.scss',
})
export class Algoritmo {
  input = signal('');
  result = signal<number[] | null>(null);
  error = signal('');

  onInput(event: Event): void {
    this.input.set((event.target as HTMLInputElement).value);
  }

  run(): void {
    this.error.set('');
    this.result.set(null);

    const parsed = this.input()
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n));

    if (parsed.length === 0) {
      this.error.set('Please enter a valid list of numbers separated by commas.');
      return;
    }

    const output = this.maiorPadrao(parsed);
    this.result.set(output);
  }

  //  ------------------------------------------logica----------------------------------------------

  maiorPadrao(arr: number[]) {
    let melhorPadrao: number[] = [];
    const total = arr.length;

    // Loop 1: percorre cada index do array recebido
    for (let inicio = 0; inicio < total; inicio++) {
      // Loop 2: para cada comprimento possível, ex [1][1,2][1,2,3,4]-[2][2,3][2,3,4]
      for (let comprimento = 1; inicio + comprimento <= total; comprimento++) {
        // slice é não-inclusivé no segundo argumento)
        const padrao = arr.slice(inicio, inicio + comprimento);

        let encontrouRepetição = false;

        // Loop 3: procura uma segunda ocorrência do padrão
        // Começa em "inicio + comprimento" para garantir que não há sobreposição
        for (let j = inicio + comprimento; j + comprimento <= total; j++) {
          let todosIguais = true;

          // Loop 4: compara os dois padrões elemento a elemento
          // "k" avança em simultaneo nos dois padroes
          for (let k = 0; k < comprimento; k++) {
            if (arr[inicio + k] !== arr[j + k]) {
              todosIguais = false;
              break; // basta um elemento diferente para saber que não é match
            }
          }

          if (todosIguais) {
            encontrouRepetição = true;
            break;
          }
        }

        // Se este padrão se repete E é maior que o melhor até agora, guardamos
        if (encontrouRepetição && padrao.length > melhorPadrao.length) {
          melhorPadrao = padrao;
        }
      }
    }

    return melhorPadrao;
  }
}
