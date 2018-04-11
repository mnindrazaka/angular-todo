import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';

import {Todo} from './todo';
import { TodoService } from './todo.service';

export enum SaveMode {
  None,
  New,
  Edit
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  formGroup: FormGroup;
  todos: Todo[];
  saveMode: SaveMode = SaveMode.None;
  headerText: String;

  constructor(private _todoService: TodoService, private _formBuilder: FormBuilder) {
    this.formGroup = _formBuilder.group({
      'id': '',
      'name': '',
      'due': '',
      'done': '',
      'notes': ''
    });
  }

  ngOnInit() {
    this.getTodos();
  }

  getTodos() {
    this.todos = this._todoService.getTodosFromData();
  }

  saveTodo(todo: Todo) {
    if (todo.id) {
      this._todoService.updateTodo(todo);
    } else {
      this._todoService.addTodo(todo);
    }
    this.saveMode = SaveMode.None;
  }

  removeTodo(todo: Todo) {
    this._todoService.deleteTodo(todo);
  }

  cancelEditTodo() {
    this.formGroup.reset();
    this.saveMode = SaveMode.None;
  }

  showEditForm(todo: Todo) {
    if(!todo) {
      return;
    }
    this.saveMode = SaveMode.Edit;
    this.headerText = 'Edit Todo';
    const editedTodo = Object.assign({}, todo, {due: this.applyLocale(todo.due) });
    this.formGroup.setValue(editedTodo);
  }

  showNewForm() {
    this.formGroup.reset();
    this.saveMode = SaveMode.New;
    this.headerText = 'New Todo';
  }

  showForm() {
    return this.saveMode !== SaveMode.None;
  }

  applyLocale(due) {
    return new DatePipe(navigator.language).transform(due, 'y-MM-dd');
  }
}
