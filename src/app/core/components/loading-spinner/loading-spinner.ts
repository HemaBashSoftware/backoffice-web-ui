import { Component, Input, OnInit } from '@angular/core';
import { LoadingSpinnerService } from './loading-spinner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  templateUrl: './loading-spinner.html',
  styleUrls: ['./loading-spinner.scss'],
  imports: [CommonModule],
})
export class LoadingSpinnerComponent implements OnInit {

  @Input() isLoading: boolean = false;

  constructor(private loadingService: LoadingSpinnerService) {}

  ngOnInit() {
    this.loadingService.isLoading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

}
