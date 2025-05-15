import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-result-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-history.component.html',
  styleUrls: ['./result-history.component.css']
})

export class HistoryComponent {
  @Input() history: { expression: string, result: number | null }[] = [];
  @Input() error: string | null = null;

}
