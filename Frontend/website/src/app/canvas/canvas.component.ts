import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { pairwise, switchMap, takeUntil } from 'rxjs/operators';
import { Prediction } from '../models/prediction';
import { DataService } from '../service/data.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-canvas',
  templateUrl:'./canvas.component.html',
  styles: [
    `
      canvas {
        border: 1px solid #000;
      }
    `
  ]
})

export class CanvasComponent implements AfterViewInit, OnDestroy {
  @Input() width = 280;
  @Input() height = 280;
  @ViewChild('canvas') canvas: ElementRef;
  cx: CanvasRenderingContext2D;
  canvasEl: HTMLCanvasElement;
  drawingSubscription: Subscription;
  predictionList: any[];
  file: File

  barChartOptions: ChartOptions = {
    responsive: true,
    scales : {
      yAxes: [{
         ticks: {
            max : 100,
            min: 0
          }
      }]
    }
  };
  barChartPlugins = [];

  barChartLabels: Label[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;

  barChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Number Prediction' }
  ];

  constructor(private dataService: DataService) {}
  

  ngAfterViewInit() {
    this.canvasEl = this.canvas.nativeElement;

    this.cx = this.canvasEl.getContext('2d');

    this.canvasEl.width = this.width;
    this.canvasEl.height = this.height;
    
    this.cx.lineWidth = 14;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#FFFFFF';
    this.cx.fillStyle = '#000'
    this.cx.fillRect(0,0,this.width,this.height)

    // we'll implement this method to start capturing mouse events
    this.captureEvents(this.canvasEl);
  }

  captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from teh canvas element
    this.drawingSubscription = fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap(e => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove').pipe(
            // we'll stop (and unsubscribe) once the user releases the mouse
            // this will trigger a 'mouseup' event
            takeUntil(fromEvent(canvasEl, 'mouseup')),
            // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
            takeUntil(fromEvent(canvasEl, 'mouseleave')),
            // pairwise lets us get the previous value to draw a line from
            // the previous point to the current point
            pairwise()
          );
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  drawOnCanvas(
    prevPos: { x: number; y: number },
    currentPos: { x: number; y: number }
  ) {
    // incase the context is not set
    if (!this.cx) {
      return;
    }

    // start our drawing path
    this.cx.beginPath();

    // we're drawing lines so we need a previous position
    if (prevPos) {
      // sets the start point
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      // draws a line from the start pos until the current position
      this.cx.lineTo(currentPos.x, currentPos.y);

      // strokes the current path with the styles we set earlier
      this.cx.stroke();
    }
  }

  onClear(){
    this.cx.clearRect(0, 0, this.width, this.height);
    this.cx.fillStyle = '#000'
    this.cx.fillRect(0,0,this.width,this.height)

  }

  
  onPredict(){
    var data = this.canvasEl.toDataURL()
    var blob = dataURItoBlob(data)

    console.log(typeof(blob))
    this.dataService.uploadBlob(blob).subscribe(data => {
      this.predictionList = []  
      console.log(this.predictionList)
      for(let key in data){
        this.predictionList.push(data[key])
      }
      this.barChartData = [
        { data: this.predictionList, label: 'Number Prediction' }
      ];
    })

    function dataURItoBlob(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var array = [];
      for(var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }

/*
    this.dataService.uploadImage(file).subscribe(data => {
    this.predictionList = []  
    console.log(this.predictionList)
    for(let key in data){
      this.predictionList.push(new Prediction(key,data[key]))
    }
  })*/
}



  ngOnDestroy() {
    // this will remove event lister when this component is destroyed
    this.drawingSubscription.unsubscribe();
  }
}