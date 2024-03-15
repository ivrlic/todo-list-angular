import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'todo-list';
  showTodoForm: boolean = false;
  showCategoryForm: boolean = false;
  showTodoList: boolean = true;
  // currentTodo: any;

  ngOnInit(): void {
    this.scrollToTop();
    // localStorage.clear();
  }

  // scroll to top and show/hide todo form
  onShowTodoForm(value: boolean) {
    this.scrollToTop();
    this.showTodoForm = value;
  }

  // scroll to top and show/hide category form
  onShowCategoryForm(value: boolean) {
    this.scrollToTop();
    this.showCategoryForm = value;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
    });
  }
}
