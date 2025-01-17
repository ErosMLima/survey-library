import * as ko from "knockout";
import { QuestionMultipleTextModel, MultipleTextItemModel } from "survey-core";
import { QuestionTextModel } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { QuestionText } from "./koquestion_text";
import { Question } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";

export class MultipleTextItem extends MultipleTextItemModel {
  constructor(name: any = null, title: string = null) {
    super(name, title);
  }
  protected createEditor(name: string): QuestionTextModel {
    return new QuestionText(name);
  }
}

export class QuestionMultipleText extends QuestionMultipleTextModel {
  private _implementor: QuestionImplementor;
  koRows: any;
  constructor(name: string) {
    super(name);
    this.koRows = ko.observableArray(this.getRows());
    this.colCountChangedCallback = () => {
      this.onColCountChanged();
    };
    this.onColCountChanged();
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionImplementor(this);
  }
  protected onColCountChanged() {
    this.koRows(this.getRows());
  }
  protected createTextItem(name: string, title: string): MultipleTextItemModel {
    return new MultipleTextItem(name, title);
  }
  public dispose() {
    this._implementor.dispose();
    this._implementor = undefined;
    this.koRows = undefined;
    super.dispose();
  }
}

Serializer.overrideClassCreator("multipletextitem", function() {
  return new MultipleTextItem("");
});

Serializer.overrideClassCreator("multipletext", function() {
  return new QuestionMultipleText("");
});

QuestionFactory.Instance.registerQuestion("multipletext", name => {
  var q = new QuestionMultipleText(name);
  q.addItem("text1");
  q.addItem("text2");
  return q;
});
