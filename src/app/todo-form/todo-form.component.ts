import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css'],
})
export class TodoFormComponent implements OnInit {
  @Output() showTodoFormEvent = new EventEmitter<boolean>();
  @Output() showTodoListEvent = new EventEmitter<boolean>();
  @Input() isEditMode!: boolean;
  @Input() currentTodo!: any;

  todoForm: FormGroup;
  formattedDate: string | null;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private apiService: ApiService
  ) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      priority: ['', Validators.required],
      category: ['', Validators.required],
      dueDate: ['', Validators.required],
    });

    const date = new Date();
    this.formattedDate = this.datePipe.transform(date, 'MM/dd/yyyy');
  }

  ngOnInit(): void {
    this.getCategories();

    if (this.isEditMode) {
      this.setFormValues();
    } else {
      this.todoForm.reset();
    }
  }

  // setting values of formular for edit mode
  private setFormValues(): void {
    this.todoForm.patchValue({
      title: this.currentTodo.attributes.title,
      description: this.currentTodo.attributes.description,
      priority: this.currentTodo.attributes.priority,
      dueDate: this.currentTodo.attributes.dueDate,
      category: [this.currentTodo.attributes.category.data.id],
    });
  }
  // currentTodo.attributes.description

  // close todo form and open todo list
  handleCancelBtn() {
    this.showTodoFormEvent.emit(false);
    this.showTodoListEvent.emit(true);
    this.scrollToTop();
    this.isEditMode = false;
    this.todoForm.reset();
  }

  // create new or edit todo, close todo form and open todo list
  handleConfirmBtn(): void {
    if (this.todoForm.valid) {
      if (this.isEditMode) {
        this.updateTodo();
      } else {
        this.createTodo();
      }
      this.showTodoFormEvent.emit(false);
      this.showTodoListEvent.emit(true);
      this.scrollToTop();
      this.isEditMode = false;
      this.todoForm.reset();
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
        dueDate: this.todoForm.get('dueDate')?.value,
        category: [this.todoForm.value.category.id],
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

  updateTodo() {
    const updatedTodoId = this.currentTodo.id;
    const updatedTodo = {
      data: {
        title: this.todoForm.get('title')?.value,
        description: this.todoForm.get('description')?.value,
        priority: this.todoForm.get('priority')?.value,
        dueDate: this.todoForm.get('dueDate')?.value,
        // // category: [this.todoForm.value.category.id],
        // category: [this.currentTodo.attributes.category.data.id],
        // category: [this.currentTodo.attributes.category.data.id],
      },
    };

    // console.log(this.todoForm.value);
    // console.log(this.todoForm.get('category')?.value[0]);
    // console.log(this.todoForm.value.category.id);

    this.apiService.updateTodo(updatedTodo, updatedTodoId).subscribe({
      next: (response) => {
        console.log('Todo successfuly created:', response);
      },
      error: (error) => {
        console.error('Error while creating todo:', error);
      },
    });
  }

  // getting categories from the api (upper case)
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
