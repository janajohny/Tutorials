import { Component, ViewChild, Input, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { AlertService, QuestionService } from "./../../services";

@Component({
  selector: "app-questionpage",
  templateUrl: "./questionpage.component.html"
})
export class QuestionpageComponent implements OnInit {
  // configuration of rich text editor(ngx-editor)
  editorConfig = {
    editable: true,
    spellcheck: true,
    height: "10rem",
    minHeight: "5rem",
    width: "auto",
    minWidth: "0",
    translate: "no",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Enter text here...",
    imageEndPoint: "",
    toolbar: [
      [
        "bold",
        "italic",
        "underline",
        "strikeThrough",
        "superscript",
        "subscript"
      ],
      ["fontName", "fontSize", "color"],
      [
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "justifyFull",
        "indent",
        "outdent"
      ],
      ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
      [
        "paragraph",
        "blockquote",
        "removeBlockquote",
        "horizontalLine",
        "orderedList",
        "unorderedList"
      ],
      ["link", "unlink", "image", "video"]
    ]
  };

  @Input()
  options = [
    {
      value: 10,
      name: "Easy"
    },
    {
      value: 20,
      name: "Medium"
    },
    {
      value: 30,
      name: "Hard"
    }
  ];

  status: number;
  message: string;
  _id;
  public selectedValue;

  //Create form
  questionForm = new FormGroup({
    _id: new FormControl(""),
    sequence: new FormControl(
      "",
      Validators.compose([
        Validators.required,
        Validators.pattern("[0-9]+"),
        Validators.min(0),
        Validators.max(2147483647)
      ])
    ),
    title: new FormControl(
      "",
      Validators.compose([Validators.required, Validators.minLength(5)])
    ),
    uniquename: new FormControl("", Validators.required),
    description: new FormControl("", Validators.compose([Validators.required])),
    mainfunction: new FormControl(
      "",
      Validators.compose([Validators.required])
    ),
    difficulty: new FormControl(10, Validators.compose([Validators.required])),
    frequency: new FormControl(
      "",
      Validators.compose([
        Validators.required,
        Validators.pattern("[0-9]+"),
        Validators.min(0),
        Validators.max(100)
      ])
    )
  });

  @ViewChild("editor") editor;
  text: string = "";

  ngAfterViewInit() {
    this.editor.setTheme("eclipse");

    this.editor.getEditor().setOptions({
      enableBasicAutocompletion: true
    });

    this.editor.getEditor().commands.addCommand({
      name: "showOtherCompletions",
      bindKey: "Ctrl-.",
      exec: function(editor) {}
    });
  }

  constructor(
    private alertService: AlertService,
    private service: QuestionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this._id = this.route.snapshot.paramMap.get("_id");
    //console.log(this._id);
    if (this._id != null) {
      this.service.getQuestionById(this._id).subscribe(
        question => {
          //console.log(question);
          this.questionForm.setValue({
            _id: question._id,
            sequence: question.sequence,
            title: question.title,
            uniquename: question.uniquename,
            description: question.description,
            mainfunction: question.mainfunction,
            difficulty: question.difficulty,
            frequency: question.frequency
          });
        },
        error => {
          this.status = error.status;
          this.message = error.message;
        }
      );
    }
  }

  onTitleChange(value) {
    if (value) {
      let words = value.split(" ");
      let name = "";
      for (let i = 0; i < words.length; i++) {
        name += words[i].toLowerCase();
        name += "-";
      }
      this.questionForm
        .get("uniquename")
        .setValue(name.slice(0, name.length - 1));
    }
  }
  //Handle create and update question
  onSubmit() {
    if (this.questionForm.invalid) {
      return; //Validation failed, exit from method.
    }
    //Form is valid, now perform create or update
    let question = this.questionForm.value;
    console.log(question);
    if (question._id == null || question._id == "") {
      //Create question
      question._id = "";
      this.service.createQuestion(question).subscribe(
        status => {
          this.alertService.success(
            "Question has been created successfully.",
            true
          );
          this.status = status;
          this.router.navigate(["/admin/questionlist"]);
        },
        error => {
          this.status = error.status;
          this.message = error.message;
        }
      );
    } else {
      //Update question
      this.service.updateQuestion(question).subscribe(
        status => {
          this.alertService.success(
            "Question has been updated successfully.",
            true
          );
          this.status = status;
          this.router.navigate(["/admin/questionlist"]);
        },
        error => {
          this.status = error.statusCode;
          this.message = error.message;
        }
      );
    }
  }

  back(url) {
    this.router.navigate([url]);
  }
}
