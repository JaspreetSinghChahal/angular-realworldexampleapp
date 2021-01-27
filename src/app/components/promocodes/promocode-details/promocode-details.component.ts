import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-promocode-details',
  templateUrl: './promocode-details.component.html',
  styleUrls: ['./promocode-details.component.scss']
})
export class PromocodeDetailsComponent implements OnInit {

  public promocodeNumber: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.promocodeNumber = parseInt(this.route.snapshot.paramMap.get('id'));
  }
}
