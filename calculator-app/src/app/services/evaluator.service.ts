import { Injectable } from '@angular/core';
import { evaluate } from '@suprnation/evaluator';

@Injectable({
  providedIn: 'root',
})
export class EvaluatorService {
  evaluateExpression(expression: string): number {
    if (!expression.trim()) {
      throw new Error('Expression cannot be empty');
    }

    const result = evaluate(expression);

    if (this.isEvaluationSuccess(result)) {
      return result.value;
    } else if (this.isEvaluationFailure(result)) {
      throw new Error(result.error || 'Invalid expression');
    } else {
      throw new Error('Unexpected evaluation result');
    }
  }

  private isEvaluationSuccess(result: any): result is { value: number } {
    return result && typeof result.value === 'number';
  }

  private isEvaluationFailure(result: any): result is { error: string } {
    return result && typeof result.error === 'string';
  }
}
