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
  categories: any[] = [];
  confirmationMsg: string = '';
  showConfirmMsg: boolean = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.categoryForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(12)]],
    });
  }

  ngOnInit(): void {
    this.getCategories();
  }

  // close category form and open todo list
  handleCancelBtn() {
    this.showCategoryFormEvent.emit(false);
    this.showTodoListEvent.emit(true);
    this.scrollToTop();
  }

  // creating new category and opening modal with a message
  handleCreateBtn() {
    const catTitle = this.categoryForm.value.title.toUpperCase();
    // check if there is another category with the same name/title
    if (this.checkSameCategory()) {
      this.confirmationMsg = `A category with the same title already exists. Please change the title.`;
      this.showConfirmMsg = true;
    } else {
      this.confirmationMsg = `${catTitle} category has been created.`;
      this.createCategory();
      this.scrollToTop();
      this.showConfirmMsg = true;
    }
  }

  // closing modal message, closing category form and opening todo list
  handleConfirmBtn() {
    if (this.checkSameCategory()) {
      this.showConfirmMsg = false;
    } else {
      this.showCategoryFormEvent.emit(false);
      this.showTodoListEvent.emit(true);
      this.showConfirmMsg = false;
    }
  }

  // check if there is another category with the same name/title
  checkSameCategory() {
    return this.categories.some((category) => {
      return (
        category.attributes.title.toUpperCase() ===
        this.categoryForm.value.title.toUpperCase()
      );
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
