import * as React from "react";
import { ISurveyCreator } from "./reactquestion";
import { SurveyModel } from "survey-core";
import { QuestionRowModel } from "survey-core";
import { SurveyElementBase } from "./reactquestion_element";
import { IElement, Base } from "survey-core";
import { ReactElementFactory } from "./element-factory";
import { settings } from "survey-core";

export class SurveyRow extends SurveyElementBase<any, any> {
  private rootRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.rootRef = React.createRef();
  }
  protected getStateElement(): Base {
    return this.row;
  }
  private get row(): QuestionRowModel {
    return this.props.row;
  }
  private get survey(): SurveyModel {
    return this.props.survey;
  }
  private get creator(): ISurveyCreator {
    return this.props.creator;
  }
  protected get css(): any {
    return this.props.css;
  }
  protected canRender(): boolean {
    return !!this.row && !!this.survey && !!this.creator && this.row.visible;
  }
  protected renderElement(): JSX.Element {
    var elements = null;
    if (this.row.isNeedRender) {
      elements = this.row.elements.map(element => this.createElement(element));
    }
    return (
      <div ref={this.rootRef} className={this.css.row}>
        {elements}
      </div>
    );
  }
  componentDidMount() {
    super.componentDidMount();
    var el = this.rootRef.current;
    if (!!el) {
      if (!this.row.isNeedRender) {
        var rowContainerDiv = el;
        setTimeout(() => {
          this.row.startLazyRendering(rowContainerDiv);
        }, 10);
      }
    }
  }
  public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    if (nextProps.row !== this.row) {
      nextProps.row.isNeedRender = this.row.isNeedRender;
      this.stopLazyRendering();
    }
    return true;
  }
  private stopLazyRendering() {
    this.row.stopLazyRendering();
    this.row.isNeedRender = !settings.lazyRowsRendering;
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    this.stopLazyRendering();
  }

  protected createElement(element: IElement): JSX.Element {
    var elementType = element.getType();
    if (!ReactElementFactory.Instance.isElementRegistered(elementType)) {
      elementType = "question";
    }
    return ReactElementFactory.Instance.createElement(elementType, {
      key: element.name,
      element: element,
      creator: this.creator,
      survey: this.survey,
      css: this.css,
    });
  }
}
