import { Component, OnInit } from '@angular/core';
import { Prediction } from '../models/prediction';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  predictionList = []
  selectedFile: File

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
  }

  onUpload() {
    this.dataService.uploadImage(this.selectedFile).subscribe(data => {
    this.predictionList = []  
    console.log(this.predictionList)
    for(let key in data){
      this.predictionList.push(new Prediction(key,data[key]))
    }
      


    console.log(this.predictionList)
    })
  }
}