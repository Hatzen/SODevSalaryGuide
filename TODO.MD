There are still negativ values for salary considered. Fix this on mapping data. 
e.g. in salaryEstimator there is:  Typical realistic range: -1.230 EUR – 2.152 EUR
but the issue probably exists already when mapping data or converting from salary.


espacially converting salaries doesnt seem to convert salaries properly from its original currency, maybe it gets converted several times and the original source currency and original salary is manipulted over time? at least for JPY in Japan the salary doesnt seem to be properly converted and considered. 

and the build in github actions still fails with libcheck

get rid off all deprecated versions and update where possible 


npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
npm warn deprecated uuid@8.3.2: uuid@10 and below is no longer supported.  For ESM codebases, update to uuid@latest.  For CommonJS codebases, use uuid@11 (but be aware this version will likely be deprecated in 2028).
npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.


Deleting the contents of '/home/runner/work/SODevSalaryGuide/SODevSalaryGuide'
Warning: The `save-state` command is deprecated and will be disabled soon. Please upgrade to using Environment Files. For more information see: https://github.blog/changelog/2022-10-11-github-actions-deprecating-save-state-and-set-output-commands/