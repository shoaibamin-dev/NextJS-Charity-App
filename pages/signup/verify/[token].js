import { useEffect, useState } from 'react';
import Head from 'next/head';
import { subscribe } from "react-contextual";
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import * as api from '@/_shared/libs/api';

import {
  Document,
  Box,
  PageHeader,
  Layouts,
  Button
} from '@/_shared/ui';

/**
 * Responsible for displaying the verification process
 * during sign up.
 */
const Verify = (props) => {

  // States
  const [ loading, setLoading ] = useState(false);
  const router = useRouter();

  // If the verification is false, return 404
  if (!props.data.verification) {
    //console.log(props.data)
    //console.log(location)
    //window.location.href = '/';
  }

  /**
   * Submits the document to the API and saves
   * the signature status.
   */
  
  const submit = async () => {

    console.log(props.token,"props.token")

    setLoading(true);

    // Get the response
    const res = await api.post('/v1/user/sign', {
      token: props.token
    });

    // Lastly, log them in and go to the dashboard.
    props.openSnackbar('Logging in...', 'success');
    props.setSession(res.token, res.session);
    api.setToken(res.token);
    setLoading(false);

    if (res.session.workplace_giving_enabled === '1') {
      router.push('/dashboard/deductions/setup')
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <>
      <Document.Header title="Signup" />
      <Layouts.Signup>
        <PageHeader steps={[ 'Sign Up', 'Verify', 'Accept Terms' ]} active={2} />
        <Box titleSize={30} paper={true} loading={loading}>
          <div id="agreement">

            <h2 >GVNG Charitable Account Agreement</h2>
            <p>
              This GVNG Charitable Account Agreement (“Agreement”) is made between GVNGorg, a California nonprofit public benefit corporation ("GVNGorg") and you, being a person or legal entity (“Account Advisor”). You agree to create a Donor Advised Fund
              and/or Fiscally Sponsored Project Account ("the GVNG Charitable Account") with GVNGorg and you expressly agree to the terms and conditions of this Agreement, the GVNGorg Terms of Service, Policies & Fees, and Privacy Policy (all three posted at
              www.gvng.org), and any updates or modifications to either of those documents made from time to time by GVNGorg.
            </p>
            <h4>1. Name</h4>
            <p>
              The GVNG Charitable Account shall be held in the name of the Account Advisor(s), subject to the approval of GVNGorg, and shall be identified as such by GVNGorg and its Board of Directors in the course of administration and distribution thereof.
            </p>
            <h4>2. Contributions</h4>
            <p>
              It is anticipated by all parties to this Agreement that from time-to-time cash and other assets acceptable to GVNGorg will be donated to the GVNG Charitable Account. Such contributions shall be appropriately acknowledged by GVNGorg. If
              contributions other than cash are made to the GVNG Charitable Account, such contributions must first be approved by GVNGorg pursuant to its gift acceptance policy. All contributions shall be administered and distributed in accordance with the
              terms and conditions of this Agreement and GVNGorg’s Terms of Service.
            </p>

            <h4>3. GVNG Charitable Account Assets</h4>
            <p>
              All assets contributed to the GVNG Charitable Account shall become an irrevocable gift to GVNGorg and legal control and responsibility for the GVNG Charitable Account rests with GVNGorg. In carrying out such responsibilities, GVNGorg shall hold,
              manage, invest, and reinvest the GVNG Charitable Account, and shall collect the income and shall pay and disburse monies from the GVNG Charitable Account for charitable uses and purposes consistent with Section 501(c)(3) of the Internal Revenue
              Code and other applicable laws.
            </p>

            <h4>4. Account Advisors & Authorized Users</h4>
            <p>
              Account Advisor(s) shall have the authority to make recommendations for grants from the GVNG Charitable Account. Only business and joint GVNG Charitable Account’s may have multiple Account Advisors and one Account Advisor will be deemed the
              Primary and the others Co-Account Advisors.
              Individual GVNG Charitable Account’s may not change the Account Advisor. Joint GVNG Charitable Account’s may change the Co-Account Advisor(s) with GVNGorg Board approval but not the Primary Account Advisor. Business GVNG Charitable Account’s may
              change the Primary and Co-Account Advisor(s) with GVNGorg Board approval. Account Advisor(s) may name a Successor Advisor to the GVNG Charitable Account to act upon the death or incapacitation of the Account Advisor(s). In the event that no
              Account Advisor is able and willing to act, GVNGorg’s Board of Directors shall make decisions without an Account Advisor in accordance with its Inactive GVNG Charitable Account Policy.
            </p>

            <p>
              Account Advisors may grant limited access to the GVNG Charitable Account through the GVNGorg platform to non-Account Advisor individuals (“Authorized Users”). Authorized Users have limited access and may not initiate contributions, request a
              distribution, or make profile changes to the GVNG Charitable Account.
            </p>

            <h4>5. Account Advisor Background Check(s)</h4>
            <p>
              GVNGorg and its designated agents and representatives will conduct a comprehensive background review through a consumer or business report and/or an investigative consumer or business report for purposes of determining eligibility for a GVNG
              Charitable Account and for verifying information. The scope of the consumer or business report/investigative consumer report may include, but is not limited to, the following areas: verification of Social Security or tax EIN number; current and
              previous residences; criminal history, including records from any criminal justice agency in any or all federal, state or county jurisdictions; birth records; and any other public records. The Account Advisor authorizes the complete release of
              these records or data pertaining to them as an individual, company, firm, corporation or public agency. The Account Advisor authorizes GVNGorg to request of any police department, financial institution or other persons having personal knowledge
              of Account Advisor to furnish GVNGorg or its designated agents with any and all information in their possession in connection with the use of this product, service or experience. Account Advisor understands that GVNGorg will utilize an outside
              firm or firms to assist it in checking such information, and such investigation is specifically authorized.
            </p>

            <h4>6. Distributions</h4>
            <p>
              The GVNG Charitable Account shall be used only for charitable purposes permitted of a Public Charity in furtherance of the purposes of GVNGorg, either directly by GVNGorg or through grants to other Public Charities for such purposes.
            </p>

            <p>
              The GVNG Charitable Account will be used to benefit the Public Charities approved by GVNGorg’s Board of Directors, which shall receive recommendations from the Advisor(s) regarding the timing, amounts and recipients of payments from the GVNG
              Charitable Account. Such recommendations may be accepted or rejected, in whole or in part, by GVNGorg’s Board of Directors in its sole and absolute discretion, as required under applicable law.
            </p>

            <p>
              No distribution from the GVNG Charitable Account shall: (a) be claimed as an income tax charitable contribution deduction; (b) result in the Donor(s) or any other individual receiving more than an incidental benefit or privilege as a result of
              such distribution; (c) be used to carry on propaganda, or attempt to influence legislation or the outcome of any public election, to carry on, whether directly or indirectly, any voter registration drive, or to undertake any activities for a
              purpose other than described in the distribution request; (d) be made to foreign charities, except those which have undergone expenditure responsibility or have received an equivalency determination; or (e) be made to private non- operating
              foundations, type III non-functionally integrated supporting organizations, or supporting organizations if the organization that is being supported is controlled by either the Donor or any Advisor.
            </p>

            <h4>7. Variance Power</h4>
            <p>
              The Board of GVNGorg has the power and the duty to modify any restriction or condition on the distribution of funds for any specified charitable purpose or organization, if, in the sole judgment of GVNGorg’s Board, such restriction or condition
              becomes, in effect, unnecessary, incapable of fulfillment or inconsistent with the charitable purpose.
            </p>

            <h4>8. Responsibilities</h4>
            <p>
              GVNGorg shall be responsible for grant distributions, bookkeeping, investment management, tax reporting, auditing and evaluation of projects, and furnishing to the Donor and/or their Advisor or Lead Advisor with access to all GVNG Charitable
              Account income and expenses on through the GVNG Platform.
            </p>

            <h4>9. GVNG Charitable Account Investment</h4>
            <p>
              The GVNG Charitable Account’s assets may be combined with other Foundation assets for investment purposes. However, GVNGorg shall keep separate accounts of this GVNG Charitable Account and investment returns which shall be based upon the
              prevailing Investment Return Policy of GVNGorg.
            </p>

            <h4>10. Administrative Fees</h4>
            <p>
              GVNGorg shall charge the GVNG Charitable Account a monthly administrative fee, which shall be based upon the prevailing Administrative Fee Schedule of GVNGorg. The fee is intended to cover administrative services. If the Directors determine that
              the actual cost of administering the GVNG Charitable Account exceeds the fee set forth by the prevailing Administrative Fee Schedule, the Directors may set a different administrative fee based on such actual costs. Fees for management of GVNG
              Charitable Account assets by outside investment managers shall be deducted at cost from gross income after income is credited to the GVNG Charitable Account. Extraordinary costs associated with the acquisition of any contribution to the GVNG
              Charitable Account also shall be deducted from the contribution before it is credited to the GVNG Charitable Account.
            </p>

            <h4>11. Component Part</h4>
            <p>
              It is intended that the GVNG Charitable Account shall be a component part of GVNGorg and not a separate entity for tax purposes, and that nothing in this Agreement shall affect the status of GVNGorg as a charitable organization described in
              Section 501(c)(3) of the Code, and as an organization that is not a private foundation within the meaning of Section 509(a) of the Code. This Agreement shall be interpreted to conform to the requirements of the foregoing provisions of the federal
              tax laws and any regulations issued pursuant thereto.
            </p>

            <p>
              This agreement along with the GVNGorg Terms of Service, Policies & Fees, and Privacy Policy (all three posted at www.gvng.org) will constitute our entire agreement concerning the GVNG Charitable Account with you.
            </p>

            <div className="breakme"></div>

            <br /><br />

            <div className="sig-header">GVNGorg</div>
            Signature:<br />
            <img src={`/signature.jpg`} /><br />
            Robert Tombosky<br />
            <i>President and Chief Executive Officer GVNGorg</i>
          </div>
        </Box>
        <div style={{ padding: '25px 0', width: '100%', textAlign: 'center' }}>
          By clicking Submit, you agree to our <a href="">Terms of Service</a>, <a href="">Policies & Fees</a>, and <a href="">Privacy</a><br /><br />
          <Button onClick={submit} type="button" theme="primary" inline>Agree</Button>
        </div>
      </Layouts.Signup>
    </>
  );
}

/**
 * Retrieve the verification data on the server first.
 */
export async function getServerSideProps({ query }) {

  // Retrieve the data from the server
  const data = await api.post('/v1/user/verification', { token: query.token });
  return { props: { data, token: query.token } };
}

export default subscribe()(Verify);
