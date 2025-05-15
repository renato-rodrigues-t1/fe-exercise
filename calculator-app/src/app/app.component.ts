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
  result: number | null = null;
  error: string | null = null;
  history: { expression: string, result: number }[] = [];

  constructor(private evaluator: EvaluatorService) {

  }

  onExpressionChange(expression: any) {
    this.evaluateExpression(expression);
  }

  evaluateExpression(expression: string) {
    this.reset();
    try {
      const result = this.evaluator.evaluateExpression(expression);
      this.result = result;
      this.addToHistory(expression, result);
    } catch (err: any) {
      this.error = err.message;
    }
  }

  private reset() {
    this.result = null;
    this.error = null;
  }

  private addToHistory(expression: string, result: number) {
    this.history.unshift({ expression, result });
    if (this.history.length > 5) {
      this.history.pop();
    }
  }
}

bootstrapApplication(App);
