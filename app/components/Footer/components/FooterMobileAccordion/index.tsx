import { useState } from 'react';
import type { ReactNode } from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import clsx from 'clsx';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/FooterMobileAccordion.css';
import {
  SubscribeContent,
  PolicyContent,
  ServiceContent,
  ContactUsContent,
  links as FooterContentLinks,
} from '../FooterContent';

export const links: LinksFunction = () => {
  return [
    ...FooterContentLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

interface FooterListTitleProps {
  onClick: () => void;
  isActive: boolean;
  title: ReactNode | string;
}

type PanelStatus = {
  [index: string]: boolean;
  panel1: boolean;
  panel2: boolean;
  panel3: boolean;
  panel4: boolean;
}

// @doc: Accordion animation https://codepen.io/felipefialho/pen/AwYmMe
function FooterListTitle({ onClick, isActive = false, title }: FooterListTitleProps) {
  return (
    <div
      className="footer-list-title"
      onClick={onClick}
    >
      <h3>
        {title}
      </h3>
      <span>
        {
          isActive
            ? <BiChevronUp />
            : <BiChevronDown />
        }

      </span>
    </div>
  );
}

interface FooterListContentProps {
  children: ReactNode;
  isActive: boolean;
}

// TODO: refactor transition mechanism.
function FooterListContent({ children, isActive }: FooterListContentProps) {
  return (
    <div
      className={clsx("footer-list-content", {
        "footer-item-grow": isActive,
      }
      )}
    >
      {children}
    </div>
  );
}
function FooterMobileAccordion() {
  const [panelStatus, setPanelStatus] = useState<PanelStatus>({
    panel1: false,
    panel2: false,
    panel3: false,
    panel4: false,
  });

  return (

    <ul className="footer-list">
      <li
        id="panel1"
        className="footer-list-panel"
      >
        <FooterListTitle
          onClick={() => {
            setPanelStatus({
              ...panelStatus,
              panel1: !panelStatus.panel1,
            });
          }}
          isActive={panelStatus.panel1}
          title="Subscribe"
        />
        <FooterListContent isActive={panelStatus['panel1']}>
          <SubscribeContent />
        </FooterListContent>
      </li>

      <li>
        <FooterListTitle
          onClick={() => {
            setPanelStatus({
              ...panelStatus,
              panel2: !panelStatus.panel2,
            });
          }}
          isActive={panelStatus.panel2}
          title="Policy"
        />

        <FooterListContent isActive={panelStatus.panel2}>
          <PolicyContent />
        </FooterListContent>
      </li>

      <li>
        <FooterListTitle
          onClick={() => {
            setPanelStatus({
              ...panelStatus,
              panel3: !panelStatus.panel3,
            });
          }}
          isActive={panelStatus.panel3}
          title="Service"
        />
        <FooterListContent isActive={panelStatus.panel3}>
          <ServiceContent />
        </FooterListContent>
      </li>

      <li>
        <FooterListTitle
          onClick={() => {
            setPanelStatus({
              ...panelStatus,
              panel4: !panelStatus.panel4,
            });
          }}
          isActive={panelStatus.panel4}
          title="Contact Us"
        />
        <FooterListContent isActive={panelStatus.panel4}>
          <ContactUsContent />
        </FooterListContent>
      </li>
    </ul>
  )
}

export default FooterMobileAccordion;