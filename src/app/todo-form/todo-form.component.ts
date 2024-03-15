import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css'],
})
export class TodoFormComponent implements OnInit {
  @Output() showTodoFormEvent = new EventEmitter<boolean>();
  @Output() showTodoListEvent = new EventEmitter<boolean>();
  @Input() currentTodo!: any;

  todoForm: FormGroup;
  categories: any[] = [];

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      priority: ['', Validators.required],
      category: ['', Validators.required],
      dueDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCategories();
  }

  // close todo form and open todo list
  handleCancelBtn() {
    this.showTodoFormEvent.emit(false);
    this.showTodoListEvent.emit(true);
    this.scrollToTop();
  }

  // create new or edit todo, close todo form and open todo list
  handleConfirmBtn(): void {
    if (this.todoForm.valid) {
      this.createTodo();
      this.showTodoFormEvent.emit(false);
      this.showTodoListEvent.emit(true);
      this.scrollToTop();
    } else {
      console.log('Form is invalid');
    }
  }

  // creating todo using api, posting it to backend
  createTodo() {
    const newTodo = {
      data: {
        title: this.todoForm.get('title')?.value,
        description: this.todoForm.get('description')?.value,
        priority: this.todoForm.get('priority')?.value,
        dueDate: moment(this.todoForm.get('dueDate')?.value).format(
          'YYYY-MM-DD'
        ),
        category: this.todoForm.value.category.id,
      },
    };

    this.apiService.createTodo(newTodo).subscribe({
      next: (response) => {
        console.log('Todo successfuly created:', response);
      },
      error: (error) => {
        console.error('Error while creating todo:', error);
      },
    });
  }

  // getting categories from the api
  getCategories() {
    this.apiService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
    });
  }
}
