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

  maiorPadrao(arr: number[]) {
    let melhorPadrao: number[] = [];
    const total = arr.length;

    for (let inicio = 0; inicio < total; inicio++) {
      for (let comprimento = 1; inicio + comprimento <= total; comprimento++) {
        const padrao = arr.slice(inicio, inicio + comprimento);

        let encontrouRepetição = false;

        for (let j = inicio + comprimento; j + comprimento <= total; j++) {
          let todosIguais = true;

          for (let k = 0; k < comprimento; k++) {
            if (arr[inicio + k] !== arr[j + k]) {
              todosIguais = false;
              break;
            }
          }

          if (todosIguais) {
            encontrouRepetição = true;
            break;
          }
        }

        if (encontrouRepetição && padrao.length > melhorPadrao.length) {
          melhorPadrao = padrao;
        }
      }
    }

    return melhorPadrao;
  }
}
