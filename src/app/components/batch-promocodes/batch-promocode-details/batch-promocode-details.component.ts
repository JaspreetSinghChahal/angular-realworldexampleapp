import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-batch-promocode-details',
  templateUrl: './batch-promocode-details.component.html',
  styleUrls: ['./batch-promocode-details.component.scss']
})
export class BatchPromocodeDetailsComponent implements OnInit {

  public batchId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.batchId = this.route.snapshot.paramMap.get('id');
  }
}
