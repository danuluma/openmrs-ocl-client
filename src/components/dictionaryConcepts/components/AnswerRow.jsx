import React from 'react';
import PropTypes from 'prop-types';
import SelectAnswers from '../containers/SelectAnswers';
import {
  INTERNAL_MAPPING_DEFAULT_SOURCE,
  KEY_CODE_FOR_ENTER,
  KEY_CODE_FOR_ESCAPE,
} from './helperFunction';
import { MIN_CHARACTERS_WARNING, MILLISECONDS_TO_SHOW_WARNING } from '../../../redux/reducers/generalSearchReducer';
import { notify } from 'react-notify-toast';
import { queryAnswers } from '../../../redux/actions/concepts/dictionaryConcepts';


class AnswerRow extends React.Component {
  constructor(props) {
    super(props);
    const DEFAULT_SOURCE = localStorage.getItem('dictionaryId');
    this.state = {
      source: DEFAULT_SOURCE,
      sourceClicked: false,
      inputValue: '',
      options: [],
      isVisible: false,
      isClicked: false,
      hasReset: false,
    };
  }

  componentDidMount() {
    this.setState({
      isEditing: this.props.isEditConcept,
      isPrePopulated: this.props.prePopulated,
      inputValue: this.props.toConceptName 
    });
  }

  resetConceptInput = (e) => {
    const value = String(e.key).length === 1 ? e.key : '';
    const {
      answer, removeCurrentAnswer, answerUrl, frontEndUniqueKey, removeCurrentSet
    } = this.props;
    if (answer.prePopulated) {
      this.setState({ inputValue: value, hasReset: true });
      removeCurrentAnswer({ answerUrl, frontEndUniqueKey, answer });
      this.handleClick();
    }
  };


  handleInputChange = (value) => {
      const { hasReset } = this.state;
      if (!hasReset) {
        this.setState({ inputValue: value });
      } else {
        this.setState({ hasReset: false });
      }
    }

  handleKeyDown = async (event, inputValue) => {
    const { isClicked } = this.state;
    const { mapType } = this.props;
    if (!isClicked) {
      this.resetConceptInput(event);
      this.setState({ isClicked: true });
    }
    if (isClicked && (event.keyCode === KEY_CODE_FOR_ENTER) && inputValue.length >= 3) {
      const { source } = this.props;
      const options = await queryAnswers(source, inputValue, mapType);
      this.setState({ options, isVisible: true });
    } else if (isClicked && (event.keyCode === KEY_CODE_FOR_ENTER) && (inputValue.length < 3)) {
      notify.show(MIN_CHARACTERS_WARNING, 'error', MILLISECONDS_TO_SHOW_WARNING);
      this.setState({ isVisible: false });
    } else if (isClicked && event.keyCode === KEY_CODE_FOR_ESCAPE) {
      this.setState({ isVisible: false });
    }
  }

  handleSelect = (res) => {
      const { handleAsyncSelectChange, frontEndUniqueKey } = this.props;
      this.setState({ isVisible: false, inputValue: res.label });
      handleAsyncSelectChange(res, frontEndUniqueKey);
    };


  handleChangeInSource = (event) => {
    const newSource = event.target.value;
    this.resetConceptInput(event);
    this.setState({
      source: newSource,
    });
  }

  handleClick = () => {
    if (!this.state.sourceClicked) {
      this.setState({
        sourceClicked: true,
        isEditing: false,
        isPrePopulated: false,
      });
    }
  }


  render() {
    const {
      removeAnswerRow,
      currentDictionaryName,
      handleAsyncSelectChange,
      frontEndUniqueKey,
      toConceptName,
      toSourceName,
      isEditConcept,
      prePopulated,
      answerUrl,
      removeCurrentAnswer,
      answer,
      mapType,
    } = this.props;
    const { source, isEditing, isPrePopulated, inputValue, isVisible, options } = this.state;
    return (
      <tr>
        <td>
          {
            isEditing && isPrePopulated ? (
              <input
                type="text"
                className="form-control"
                defaultValue={toSourceName}
                onClick={this.handleClick}
                required
              />
            ) : (
              <select
                name="map_scope"
                className="form-control"
                onChange={event => this.handleChangeInSource(event)}
                required
              >
                <option value={localStorage.getItem('dictionaryId')}>
                  {currentDictionaryName}
                  &nbsp;(Dictionary)
                </option>
                <option value={INTERNAL_MAPPING_DEFAULT_SOURCE}>
                  {INTERNAL_MAPPING_DEFAULT_SOURCE}
                  &nbsp;(Source)
                </option>
              </select>
            )
          }
        </td>
        <td className="react-async">
          {
            <SelectAnswers
              handleAsyncSelectChange={handleAsyncSelectChange}
              source={source}
              frontEndUniqueKey={frontEndUniqueKey}
              isShown={false}
              removeCurrentAnswer={removeCurrentAnswer}
              answer={answer}
              answerUrl={answerUrl}
              mapType={mapType}
              inputValue={inputValue}
              handleInputChange={this.handleInputChange}
              handleKeyDown={this.handleKeyDown}
              handleSelect={this.handleSelect}
              isVisible={isVisible}
              options={options}
            />
        }
        </td>
        <td>
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => removeAnswerRow(
              frontEndUniqueKey,
              isEditConcept,
              answerUrl,
              toConceptName,
              prePopulated,
            )}
            id="removeAnswer"
          >
                remove
          </button>
        </td>
      </tr>

    );
  }
}


AnswerRow.propTypes = {
  display_name: PropTypes.string,
  handleAnswerChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  answerUrl: PropTypes.string,
  prePopulated: PropTypes.bool,
  isEditConcept: PropTypes.bool.isRequired,
  removeAnswerRow: PropTypes.func.isRequired,
  toConceptName: PropTypes.string,
  toSourceName: PropTypes.string,
  frontEndUniqueKey: PropTypes.string,
  handleAsyncSelectChange: PropTypes.func.isRequired,
  removeCurrentAnswer: PropTypes.func.isRequired,
  currentDictionaryName: PropTypes.string,
  answer: PropTypes.object.isRequired,
  mapType: PropTypes.string.isRequired,
};

AnswerRow.defaultProps = {
  display_name: '',
  id: '',
  answerUrl: '',
  prePopulated: false,
  toConceptName: '',
  toSourceName: '',
  currentDictionaryName: '',
  frontEndUniqueKey: 'unique',
};


export default AnswerRow;
