import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-todo-form',
  templateUrl: './edit-todo-form.component.html',
  styleUrls: ['./edit-todo-form.component.css'],
})
export class EditTodoFormComponent implements OnInit {
  @Output() offEditModeEvent = new EventEmitter<boolean>();
  @Input() currentTodo!: any;

  todoForm: FormGroup;
  // formattedDate: string | null;
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

    // const date = new Date();
    // this.formattedDate = this.datePipe.transform(date, 'MM/dd/yyyy');
  }

  ngOnInit(): void {
    this.getCategories();
    this.setFormValues();
  }

  // setting values of formular for edit mode
  private setFormValues(): void {
    this.todoForm.patchValue({
      title: this.currentTodo.attributes.title,
      description: this.currentTodo.attributes.description,
      priority: this.currentTodo.attributes.priority,
      dueDate: this.currentTodo.attributes.dueDate,
      category: this.currentTodo.attributes.category.data.id,
    });
  }

  // close todo form and open todo list
  handleCancelBtn() {
    this.offEditModeEvent.emit(false);
    this.scrollToTop();
  }

  // create new or edit todo, close todo form and open todo list
  handleConfirmBtn(): void {
    if (this.todoForm.valid) {
      this.updateTodo();
      this.scrollToTop();
      setTimeout(() => {
        this.offEditModeEvent.emit(false);
      }, 100);
    } else {
      console.log('Form is invalid');
    }
  }

  // creating updated todo of the form values and posting it to backend rest api
  updateTodo() {
    const updatedTodoId = this.currentTodo.id;
    const updatedTodo = {
      data: {
        title: this.todoForm.get('title')?.value,
        description: this.todoForm.get('description')?.value,
        priority: this.todoForm.get('priority')?.value,
        dueDate: moment(this.todoForm.get('dueDate')?.value).format(
          'YYYY-MM-DD'
        ),
        category: this.todoForm.value.category,
      },
    };

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
