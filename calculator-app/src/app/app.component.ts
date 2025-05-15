import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { HistoryComponent } from './components/history/history.component';
import { EvaluatorService } from './services/evaluator.service';
import { bootstrapApplication } from '@angular/platform-browser';


@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, CalculatorComponent, HistoryComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class App {
  initialExpressionTest = this.evaluator.evaluateExpression("1+2+sin(24+cos(23))");
  currentExpression: string = '';
  result: number | null = null;
  error: string | null = null;
  history: { expression: string, result: number }[] = [];

  constructor(private evaluator: EvaluatorService) {

  }
  onExpressionChange(expression: string) {
    this.currentExpression = expression;
    this.evaluateExpression(expression);
  }

  evaluateExpression(expression: string) {
    this.reset();
    try {
      const result = this.evaluator.evaluateExpression(expression);
      this.result = result;
      this.updateHistory(expression, result);
    } catch (err: any) {
      this.error = err.message;
    }
  }

  private reset() {
    this.result = null;
    this.error = null;
  }

  private updateHistory(expression: string, result: number) {
    // Check if the current expression is already in history (avoid duplicates)
    if (this.history.length === 0 || this.history[0].expression !== expression) {
      this.history.unshift({ expression, result });

      // Ensure the history is limited to the last 5 excluding the current which is already being shown under
      if (this.history.length > 6) {
        this.history = this.history.slice(0, 6);
      }
    }
  }

  get historyWithoutCurrent(): { expression: string, result: number }[] {
    // History excluding the current result
    return this.history.length > 1 ? this.history.slice(1, 6) : [];
  }
}

bootstrapApplication(App);
