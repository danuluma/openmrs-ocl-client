import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class SelectAnswers extends PureComponent {
    render() {
      const { index, isShown, inputValue, handleInputChange, handleKeyDown, handleSelect, isVisible, options } = this.props;
      return (
        <div className="conceptDetails">
          <input
            tabIndex={index}
            className="form-control"
            placeholder="Search"
            type="text"
            id="searchInputCiel"
            name="to_concept_name"
            value={inputValue}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={e => handleKeyDown(e, inputValue)}
          />
          {(isVisible || isShown) && <ul className="cielConceptsList">
            {options.map(result => <li key={result.uuid}>
              <button
                type="button"
                id="selectConcept"
                name="selectButton"
                onClick={() => handleSelect(result)}
              >
                {`ID(${result.id}) - ${result.display_name}`}
              </button>
            </li>)}
          </ul>}
        </div>
      );
    }
}

SelectAnswers.propTypes = {
  handleAsyncSelectChange: PropTypes.func.isRequired,
  source: PropTypes.string,
  defaultValue: PropTypes.string,
  frontEndUniqueKey: PropTypes.string.isRequired,
  index: PropTypes.number,
  isShown: PropTypes.bool,
  answer: PropTypes.object,
  removeCurrentAnswer: PropTypes.func.isRequired,
  answerUrl: PropTypes.string,
  mapType: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired
};

SelectAnswers.defaultProps = {
  source: '',
  defaultValue: '',
  index: 0,
  isShown: false,
  answer: {},
  answerUrl: '',
};

export default SelectAnswers;
