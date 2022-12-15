import React, { PropTypes } from 'react'

import styles from './404.css'

const FourOhFour = props => (
  <div className={styles.root}>
    <div className={styles.top}>
      <div className={styles.title} />
      <div className={styles.indication}>
        <div className={styles.powerLine}>
          Oops, how'd you get here?!
        </div>
        <div>Something went wrong,</div>
        <div>return to&nbsp;
          <span className={styles.homeLink} onClick={props.onHome}>
            Home Page
          </span>
        </div>
      </div>
    </div>
    <div className={styles.mountain} />
  </div>
)

FourOhFour.defaultProps = {
  onHome: () => {},
}

FourOhFour.propTypes = {
  onHome: PropTypes.func,
}

export default FourOhFour
