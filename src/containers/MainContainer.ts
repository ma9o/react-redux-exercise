import * as actionCreators from '../redux/actions';
import DictionariesOverview from '../components/DictionariesOverview';
import { bindActionCreators } from 'redux';
import { checkConsistency } from '../utils/utils';
import { connect } from 'react-redux';
import { Dictionary } from '../utils/types';

const mapStateToProps = (state: any) => {
  return {
    rows: state.main.rows.map((dict: Dictionary) => {
      const errors = checkConsistency(dict);
      return {
        ...dict,
        data: dict.data.map(pair => ({ ...pair, errors: errors.get(pair.id) }))
      };
    })
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DictionariesOverview);
