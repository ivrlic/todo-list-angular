import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit {
  @Output() showCategoryFormEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() showTodoListEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  categoryForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.categoryForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(12)]],
    });
  }

  ngOnInit(): void {}

  // close category form and open todo list
  handleCancelBtn() {
    this.showCategoryFormEvent.emit(false);
    this.showTodoListEvent.emit(true);
    this.scrollToTop();
  }

  // create new category, close category form and open todo list
  handleCreateBtn() {
    this.createCategory();
    this.showCategoryFormEvent.emit(false);
    this.showTodoListEvent.emit(true);
    this.scrollToTop();
  }

  // creating category using api, posting it to backend
  createCategory() {
    if (this.categoryForm.valid) {
      const newCategory = { data: this.categoryForm.value };

      this.apiService.createCategory(newCategory).subscribe({
        next: (response) => {
          console.log('Category successfuly created:', response);
        },
        error: (error) => {
          console.error('Error while creating category:', error);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
    });
  }
}
