import { useState, useMemo } from 'react';

import { useStore } from '../../context';
import { JobCard } from '../../components/JobCard';
import { locations, trades } from '../../seedData';
import { isWorkerMatchingJob } from '../../utils/matching';

import { Search, SlidersHorizontal, Bookmark, BriefcaseBusiness, ArrowRight, RotateCcw, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

export function Jobs() {
  const { jobs, worker, savedJobIds } = useStore();

  const [query, setQuery] = useState('');
  const [onlyMySkills, setOnlyMySkills] = useState(true); // Default: STRICT TRADE MATCHING!
  const [selectedTrade, setSelectedTrade] = useState<string>('All trades');
  const [selectedCity, setSelectedCity] = useState<string>('All cities');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('All neighborhoods');
  const [selectedEmpType, setSelectedEmpType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'week' | 'longer' | 'saved'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'wage' | 'distance'>('recommended');

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // 1. Status filter
      if (job.status !== 'open') return false;

      // 2. Strict Trade & Skill Matching (Critical Requirement 5)
      if (onlyMySkills) {
        if (!isWorkerMatchingJob(worker, job)) {
          return false;
        }
      } else if (selectedTrade !== 'All trades') {
        if (job.trade.toLowerCase() !== selectedTrade.toLowerCase()) {
          return false;
        }
      }

      // 3. Saved tab filter
      if (activeTab === 'saved') {
        if (!savedJobIds.includes(job.id)) return false;
      } else if (activeTab === 'today') {
        if (job.date !== 'Today') return false;
      } else if (activeTab === 'week') {
        if (job.date !== 'Today' && job.date !== 'Tomorrow' && job.date !== 'This week') return false;
      } else if (activeTab === 'longer') {
        if (job.employmentType === 'daily') return false;
      }

      // 4. Employment Type / Duration filter (Requirement 8)
      if (selectedEmpType !== 'all') {
        if (selectedEmpType === 'long_term') {
          if (job.employmentType !== 'long_term' && job.employmentType !== 'monthly') return false;
        } else if (job.employmentType !== selectedEmpType) {
          return false;
        }
      }

      // 5. City and Neighborhood filter (Requirement 9 & 10)
      if (selectedCity !== 'All cities') {
        if (job.city !== selectedCity) return false;
      }

      if (selectedNeighborhood !== 'All neighborhoods') {
        if (job.neighborhood !== selectedNeighborhood && !job.area.includes(selectedNeighborhood)) {
          return false;
        }
      }

      // 6. Text query
      if (query.trim()) {
        const text = `${job.title} ${job.description} ${job.area} ${job.employer} ${job.trade} ${job.neighborhood || ''} ${job.city || ''}`.toLowerCase();
        if (!text.includes(query.toLowerCase())) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'wage') return b.wage - a.wage;
      if (sortBy === 'distance') {
        const distA = parseFloat(a.distance) || 99;
        const distB = parseFloat(b.distance) || 99;
        return distA - distB;
      }
      // Recommended: prioritize current worker trade & nearest
      if (isWorkerMatchingJob(worker, a) && !isWorkerMatchingJob(worker, b)) return -1;
      if (!isWorkerMatchingJob(worker, a) && isWorkerMatchingJob(worker, b)) return 1;
      return 0;
    });
  }, [
    jobs,
    worker,
    onlyMySkills,
    selectedTrade,
    activeTab,
    selectedEmpType,
    selectedCity,
    selectedNeighborhood,
    query,
    sortBy,
    savedJobIds
  ]);

  const clearFilters = () => {
    setQuery('');
    setOnlyMySkills(true);
    setSelectedTrade('All trades');
    setSelectedCity('All cities');
    setSelectedNeighborhood('All neighborhoods');
    setSelectedEmpType('all');
    setActiveTab('all');
    setSortBy('recommended');
  };

  // Neighborhoods filtered by selected city
  const availableNeighborhoods = useMemo(() => {
    if (selectedCity === 'All cities') return locations;
    return locations.filter(l => l.city === selectedCity);
  }, [selectedCity]);

  return (
    <div className="worker-jobs-page">
      {/* Page Header */}
      <div className="page-header-block">
        <div className="header-text-side">
          <div className="eyebrow-chip">
            <Sparkles size={13} /> FIND LOCAL WORK
          </div>
          <h1 className="page-main-title">Work that fits your skills & schedule.</h1>
          <p className="page-main-subtitle">
            Showing verified work matching your trade ({worker.trade}) with clear wages, hours, and site location.
          </p>
        </div>

        {/* Skill Matching Toggle Pill */}
        <div className="matching-toggle-wrap">
          <button
            type="button"
            className={`matching-toggle-btn ${onlyMySkills ? 'is-active' : ''}`}
            onClick={() => {
              const next = !onlyMySkills;
              setOnlyMySkills(next);
              if (next) setSelectedTrade('All trades');
            }}
          >
            <CheckCircle2 size={15} />
            <span>
              {onlyMySkills
                ? `Matching My Trade (${worker.trade})`
                : 'Showing All Trades'}
            </span>
          </button>
        </div>
      </div>

      {/* Search & Multi-Filter Toolbar */}
      <div className="jobs-filter-toolbar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-field-icon" />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search by job title, site location, or skill keyword..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="clear-query-btn"
              onClick={() => setQuery('')}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="toolbar-controls-row">
          {/* Trade Filter (Disabled when strict matching is locked) */}
          <div className="trade-select-wrap">
            <SlidersHorizontal size={15} className="select-icon" />
            <select
              value={onlyMySkills ? worker.trade : selectedTrade}
              disabled={onlyMySkills}
              onChange={e => setSelectedTrade(e.target.value)}
              className="trade-dropdown"
              aria-label="Filter by trade"
              title={onlyMySkills ? 'Disable trade match toggle to browse other trades' : 'Select trade'}
            >
              <option value="All trades">All Trades</option>
              {trades.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="trade-select-wrap">
            <MapPin size={15} className="select-icon" />
            <select
              value={selectedCity}
              onChange={e => {
                setSelectedCity(e.target.value);
                setSelectedNeighborhood('All neighborhoods');
              }}
              className="trade-dropdown"
              aria-label="Filter by city"
            >
              <option value="All cities">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Navi Mumbai">Navi Mumbai</option>
            </select>
          </div>

          {/* Neighborhood Filter */}
          <div className="trade-select-wrap">
            <select
              value={selectedNeighborhood}
              onChange={e => setSelectedNeighborhood(e.target.value)}
              className="trade-dropdown"
              aria-label="Filter by neighborhood"
            >
              <option value="All neighborhoods">All Localities ({availableNeighborhoods.length})</option>
              {availableNeighborhoods.map(l => (
                <option key={l.neighborhood} value={l.neighborhood}>
                  {l.neighborhood} ({l.city})
                </option>
              ))}
            </select>
          </div>

          {/* Employment Type Filter (Requirement 8) */}
          <div className="trade-select-wrap">
            <select
              value={selectedEmpType}
              onChange={e => setSelectedEmpType(e.target.value)}
              className="trade-dropdown"
              aria-label="Filter by employment type"
            >
              <option value="all">All Employment Types</option>
              <option value="daily">Daily Work (₹/day)</option>
              <option value="contract">Short-Term Contract</option>
              <option value="weekly">Weekly Work (₹/week)</option>
              <option value="monthly">Monthly Work (₹/month)</option>
              <option value="long_term">Long-Term / Ongoing</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="sort-select-wrap">
            <span className="sort-label">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="sort-dropdown"
              aria-label="Sort listings"
            >
              <option value="recommended">Best Match ({worker.trade})</option>
              <option value="wage">Highest Pay (₹)</option>
              <option value="distance">Nearest Distance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Time & Saved Tabs */}
      <div className="filter-tabs-row">
        <button
          type="button"
          className={`tab-chip ${activeTab === 'all' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Opportunities
        </button>
        <button
          type="button"
          className={`tab-chip ${activeTab === 'today' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('today')}
        >
          Urgent / Today
        </button>
        <button
          type="button"
          className={`tab-chip ${activeTab === 'week' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('week')}
        >
          This Week
        </button>
        <button
          type="button"
          className={`tab-chip ${activeTab === 'longer' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('longer')}
        >
          Multi-Day & Long-Term
        </button>
        <button
          type="button"
          className={`tab-chip tab-saved ${activeTab === 'saved' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <Bookmark size={14} />
          <span>Saved</span>
          <span className="count-badge">{savedJobIds.length}</span>
        </button>
      </div>

      {/* Results Header Count */}
      <div className="results-count-bar">
        <span>
          Showing <strong>{filteredJobs.length}</strong> available job
          {filteredJobs.length === 1 ? '' : 's'}
          {onlyMySkills ? ` matching ${worker.trade}` : ''}
          {selectedCity !== 'All cities' ? ` in ${selectedCity}` : ''}
          {selectedNeighborhood !== 'All neighborhoods' ? ` (${selectedNeighborhood})` : ''}
        </span>
        {(query || selectedCity !== 'All cities' || selectedNeighborhood !== 'All neighborhoods' || selectedEmpType !== 'all' || activeTab !== 'all' || !onlyMySkills) && (
          <button type="button" onClick={clearFilters} className="reset-filter-btn">
            <RotateCcw size={13} /> Reset filters
          </button>
        )}
      </div>

      {/* Job Card Grid */}
      {filteredJobs.length > 0 ? (
        <div className="jobs-directory-grid">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="empty-state-card">
          <div className="empty-icon-box">
            <BriefcaseBusiness size={28} />
          </div>
          <h3 className="empty-title">
            {activeTab === 'saved'
              ? 'No saved jobs yet.'
              : `No matching ${worker.trade} jobs found with current filters.`}
          </h3>
          <p className="empty-desc">
            {activeTab === 'saved'
              ? 'Click the bookmark icon on any job card to save it for quick review later.'
              : `We maintain strict trade matching so you only see work for ${worker.trade}s. Try widening your location or clearing filters to see more opportunities across Mumbai & Navi Mumbai.`}
          </p>
          <button type="button" onClick={clearFilters} className="btn-primary-small">
            Reset filters & show all {worker.trade} jobs <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
