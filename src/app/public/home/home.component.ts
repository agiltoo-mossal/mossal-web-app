import { Component } from '@angular/core';
import {
  Course,
  FetchOpenCoursesGQL,
  FetchOpenPathsGQL,
  Path,
} from 'src/graphql/generated';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  cardOverVieweList: any;
  coursePopularList: any;
  constructor(
    private fetchOpenCoursesGQL: FetchOpenCoursesGQL,
    private fetchOpenPathsGQL: FetchOpenPathsGQL
  ) {
    this.fetchOpenCoursesGQL.fetch().subscribe((result) => {
      const courses = result.data.fetchOpenCourses as Course[];
      this.coursePopularList = courses.slice(0, 3);
    });
    this.fetchOpenPathsGQL.fetch().subscribe((result) => {
      const paths = result.data.fetchOpenPaths as Path[];
      this.cardOverVieweList = paths.slice(0, 3);
    });
  }
  testimonialList: any[] = [{}, {}, {}];
}
