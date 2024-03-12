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
  }

  // if todo form is open, category form has to be closed
  onShowTodoForm(value: boolean) {
    this.scrollToTop();
    this.showTodoForm = value;
    this.showCategoryForm = !value;
  }

  // if category form is open, todo form has to be closed
  onShowCategoryForm(value: boolean) {
    this.scrollToTop();
    this.showCategoryForm = value;
    this.showTodoForm = !value;
  }

  // after item changed render again todos/tasks
  toggleItemChanged(value: boolean) {
    this.showTodoForm = true;
  }

  // getCurrentTodoEvent(todo: any) {
  //   this.currentTodo = todo;
  // }

  scrollToTop() {
    window.scrollTo({
      top: 0,
    });
  }
}
