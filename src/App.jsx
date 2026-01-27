import { useState, useCallback } from 'react'                                                                                           
  import Papa from 'papaparse'                                                                                                            
  import {                                                                                                                                
    User,                                                                                                                                 
    Briefcase,                                                                                                                            
    Dumbbell,                                                                                                                             
    Heart,                                                                                                                                
    Settings,                                                                                                                             
    Send,                                                                                                                                 
    Check,                                                                                                                                
    ArrowRight,                                                                                                                           
    Shield,                                                                                                                               
    GraduationCap,                                                                                                                        
    School,                                                                                                                               
    Brain,                                                                                                                                
    Target,                                                                                                                               
    Apple,                                                                                                                                
    Zap,                                                                                                                                  
    Loader2,                                                                                                                              
    CheckCircle                                                                                                                           
  } from 'lucide-react'                                                                                                                   
                                                                                                                                          
  // ============================================                                                                                         
  // FORMSPREE CONFIGURATION                                                                                                              
  // Get your form ID from https://formspree.io                                                                                           
  // ============================================                                                                                         
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mykwonwn'                                                                            
                                                                                                                                          
  // ============================================                                                                                         
  // DEFAULT FORM CONFIGURATION                                                                                                           
  // Mimics a Google Sheet structure                                                                                                      
  // audience: 'All', 'HighSchool', 'College', 'Pro'                                                                                      
  // ============================================                                                                                         
  const DEFAULT_FORM_CONFIG = [                                                                                                           
    // THE BASICS - Biographical                                                                                                          
    {                                                                                                                                     
      id: 'full_name',                                                                                                                    
      label: 'Full Name',                                                                                                                 
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'All',                                                                                                                    
      placeholder: 'Enter your full legal name',                                                                                          
      required: true                                                                                                                      
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'preferred_name',                                                                                                               
      label: 'Preferred Name / Nickname',                                                                                                 
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'All',                                                                                                                    
      placeholder: 'What should we call you?'                                                                                             
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'date_of_birth',                                                                                                                
      label: 'Date of Birth',                                                                                                             
      type: 'date',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'All',                                                                                                                    
      required: true                                                                                                                      
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'position',                                                                                                                     
      label: 'Primary Position',                                                                                                          
      type: 'select',                                                                                                                     
      category: 'Biographical',                                                                                                           
      audience: 'All',                                                                                                                    
      options: ['Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base', 'Shortstop', 'Left Field', 'Center Field', 'Right Field',
   'Designated Hitter', 'Utility'],                                                                                                       
      required: true                                                                                                                      
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'secondary_position',                                                                                                           
      label: 'Secondary Position (if any)',                                                                                               
      type: 'select',                                                                                                                     
      category: 'Biographical',                                                                                                           
      audience: 'All',                                                                                                                    
      options: ['None', 'Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base', 'Shortstop', 'Left Field', 'Center Field', 'Right
   Field', 'Designated Hitter', 'Utility']                                                                                                
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'throws',                                                                                                                       
      label: 'Throwing Hand',                                                                                                             
      type: 'select',                                                                                                                     
      category: 'Biographical',                                                                                                           
      audience: 'All',                                                                                                                    
      options: ['Right', 'Left', 'Ambidextrous'],                                                                                         
      required: true                                                                                                                      
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'bats',                                                                                                                         
      label: 'Batting Side',                                                                                                              
      type: 'select',                                                                                                                     
      category: 'Biographical',                                                                                                           
      audience: 'All',                                                                                                                    
      options: ['Right', 'Left', 'Switch'],                                                                                               
      required: true                                                                                                                      
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'height',                                                                                                                       
      label: 'Height',                                                                                                                    
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'All',                                                                                                                    
      placeholder: "e.g., 6'2\""                                                                                                          
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'weight',                                                                                                                       
      label: 'Weight (lbs)',                                                                                                              
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'All',                                                                                                                    
      placeholder: 'e.g., 195'                                                                                                            
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'email',                                                                                                                        
      label: 'Email Address',                                                                                                             
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'All',                                                                                                                    
      placeholder: 'your@email.com',                                                                                                      
      required: true                                                                                                                      
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'phone',                                                                                                                        
      label: 'Phone Number',                                                                                                              
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'All',                                                                                                                    
      placeholder: '(555) 123-4567'                                                                                                       
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'hometown',                                                                                                                     
      label: 'Hometown',                                                                                                                  
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'All',                                                                                                                    
      placeholder: 'City, State'                                                                                                          
    },                                                                                                                                    
                                                                                                                                          
    // HIGH SCHOOL specific fields                                                                                                        
    {                                                                                                                                     
      id: 'parents_names',                                                                                                                
      label: "Parents' Names",                                                                                                            
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'HighSchool',                                                                                                             
      placeholder: 'e.g., John & Jane Smith'                                                                                              
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'parent_contact',                                                                                                               
      label: 'Parent/Guardian Contact',                                                                                                   
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'HighSchool',                                                                                                             
      placeholder: 'Phone or email'                                                                                                       
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'high_school',                                                                                                                  
      label: 'High School',                                                                                                               
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'HighSchool',                                                                                                             
      placeholder: 'School name'                                                                                                          
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'hs_graduation_year',                                                                                                           
      label: 'Expected Graduation Year',                                                                                                  
      type: 'select',                                                                                                                     
      category: 'Biographical',                                                                                                           
      audience: 'HighSchool',                                                                                                             
      options: ['2025', '2026', '2027', '2028', '2029']                                                                                   
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'travel_team',                                                                                                                  
      label: 'Travel Team / Club',                                                                                                        
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'HighSchool',                                                                                                             
      placeholder: 'Current travel team name'                                                                                             
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'college_commitment',                                                                                                           
      label: 'College Commitment Status',                                                                                                 
      type: 'select',                                                                                                                     
      category: 'Biographical',                                                                                                           
      audience: 'HighSchool',                                                                                                             
      options: ['Uncommitted', 'Verbal Commit', 'Signed NLI', 'Not pursuing college']                                                     
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'college_preferences',                                                                                                          
      label: 'Dream Schools',                                                                                                             
      type: 'textarea',                                                                                                                   
      category: 'Biographical',                                                                                                           
      audience: 'HighSchool',                                                                                                             
      placeholder: "List any schools you're interested in..."                                                                             
    },                                                                                                                                    
                                                                                                                                          
    // COLLEGE specific fields                                                                                                            
    {                                                                                                                                     
      id: 'college_name',                                                                                                                 
      label: 'College / University',                                                                                                      
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'College',                                                                                                                
      placeholder: 'School name'                                                                                                          
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'college_class',                                                                                                                
      label: 'Class Year',                                                                                                                
      type: 'select',                                                                                                                     
      category: 'Biographical',                                                                                                           
      audience: 'College',                                                                                                                
      options: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']                                                                  
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'eligibility_remaining',                                                                                                        
      label: 'Eligibility Remaining',                                                                                                     
      type: 'select',                                                                                                                     
      category: 'Biographical',                                                                                                           
      audience: 'College',                                                                                                                
      options: ['4 years', '3 years', '2 years', '1 year', 'Final year']                                                                  
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'transfer_status',                                                                                                              
      label: 'Transfer Portal Status',                                                                                                    
      type: 'select',                                                                                                                     
      category: 'Biographical',                                                                                                           
      audience: 'College',                                                                                                                
      options: ['Not in portal', 'Entered portal', 'Considering portal']                                                                  
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'college_coach',                                                                                                                
      label: 'Head Coach',                                                                                                                
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'College',                                                                                                                
      placeholder: "Coach's name"                                                                                                         
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'summer_league',                                                                                                                
      label: 'Summer League',                                                                                                             
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'College',                                                                                                                
      placeholder: 'e.g., Cape Cod League'                                                                                                
    },                                                                                                                                    
                                                                                                                                          
    // PRO specific fields                                                                                                                
    {                                                                                                                                     
      id: 'current_agent',                                                                                                                
      label: 'Current Agent/Rep',                                                                                                         
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'Pro',                                                                                                                    
      placeholder: 'If transitioning from another agency'                                                                                 
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'union_id',                                                                                                                     
      label: 'MLBPA Union ID',                                                                                                            
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'Pro',                                                                                                                    
      placeholder: 'If applicable'                                                                                                        
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'current_organization',                                                                                                         
      label: 'Current Organization',                                                                                                      
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'Pro',                                                                                                                    
      placeholder: 'Team / Organization name'                                                                                             
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'current_level',                                                                                                                
      label: 'Current Level',                                                                                                             
      type: 'select',                                                                                                                     
      category: 'Biographical',                                                                                                           
      audience: 'Pro',                                                                                                                    
      options: ['Rookie Ball', 'Single-A', 'High-A', 'Double-A', 'Triple-A', 'MLB', 'Free Agent', 'Independent']                          
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'service_time',                                                                                                                 
      label: 'MLB Service Time',                                                                                                          
      type: 'text',                                                                                                                       
      category: 'Biographical',                                                                                                           
      audience: 'Pro',                                                                                                                    
      placeholder: 'e.g., 2.145 years'                                                                                                    
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'contract_status',                                                                                                              
      label: 'Contract Status',                                                                                                           
      type: 'select',                                                                                                                     
      category: 'Biographical',                                                                                                           
      audience: 'Pro',                                                                                                                    
      options: ['Pre-Arbitration', 'Arbitration Eligible', 'Free Agent', 'Under Contract', 'Minor League Contract']                       
    },                                                                                                                                    
                                                                                                                                          
    // THE SETUP - Equipment & Preferences                                                                                                
    {                                                                                                                                     
      id: 'glove_brand',                                                                                                                  
      label: 'Preferred Glove Brand',                                                                                                     
      type: 'select',                                                                                                                     
      category: 'Preferences',                                                                                                            
      audience: 'All',                                                                                                                    
      options: ['Rawlings', 'Wilson', 'Mizuno', 'Easton', '44 Pro', 'Other', 'No Preference']                                             
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'bat_brand',                                                                                                                    
      label: 'Preferred Bat Brand',                                                                                                       
      type: 'select',                                                                                                                     
      category: 'Preferences',                                                                                                            
      audience: 'All',                                                                                                                    
      options: ['Louisville Slugger', 'Marucci', 'Victus', 'DeMarini', 'Easton', 'Other', 'No Preference']                                
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'shoe_size',                                                                                                                    
      label: 'Shoe Size',                                                                                                                 
      type: 'text',                                                                                                                       
      category: 'Preferences',                                                                                                            
      audience: 'All',                                                                                                                    
      placeholder: 'e.g., 11.5'                                                                                                           
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'cleat_preference',                                                                                                             
      label: 'Cleat Brand Preference',                                                                                                    
      type: 'select',                                                                                                                     
      category: 'Preferences',                                                                                                            
      audience: 'All',                                                                                                                    
      options: ['Nike', 'New Balance', 'Under Armour', 'Adidas', 'Mizuno', 'Other', 'No Preference']                                      
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'jersey_size',                                                                                                                  
      label: 'Jersey Size',                                                                                                               
      type: 'select',                                                                                                                     
      category: 'Preferences',                                                                                                            
      audience: 'All',                                                                                                                    
      options: ['S', 'M', 'L', 'XL', 'XXL']                                                                                               
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'pants_size',                                                                                                                   
      label: 'Pants Size',                                                                                                                
      type: 'text',                                                                                                                       
      category: 'Preferences',                                                                                                            
      audience: 'All',                                                                                                                    
      placeholder: 'e.g., 32x32'                                                                                                          
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'hat_size',                                                                                                                     
      label: 'Hat Size',                                                                                                                  
      type: 'select',                                                                                                                     
      category: 'Preferences',                                                                                                            
      audience: 'All',                                                                                                                    
      options: ['6 7/8', '7', '7 1/8', '7 1/4', '7 3/8', '7 1/2', '7 5/8', '7 3/4', '7 7/8', '8']                                         
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'equipment_deals',                                                                                                              
      label: 'Current Equipment Deals',                                                                                                   
      type: 'textarea',                                                                                                                   
      category: 'Preferences',                                                                                                            
      audience: 'Pro',                                                                                                                    
      placeholder: 'List any existing endorsement or equipment arrangements...'                                                           
    },                                                                                                                                    
                                                                                                                                          
    // THE GRIND - Schedule & Training (now more clickable)                                                                               
    {                                                                                                                                     
      id: 'training_facility_type',                                                                                                       
      label: 'Primary Training Environment',                                                                                              
      type: 'select',                                                                                                                     
      category: 'Schedule',                                                                                                               
      audience: 'All',                                                                                                                    
      options: ['Team Facility', 'Private Training Center', 'College Facility', 'Home Gym', 'Public Gym', 'Multiple Locations']           
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'current_facility',                                                                                                             
      label: 'Facility Name',                                                                                                             
      type: 'text',                                                                                                                       
      category: 'Schedule',                                                                                                               
      audience: 'All',                                                                                                                    
      placeholder: 'Name of your primary training facility'                                                                               
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'has_strength_coach',                                                                                                           
      label: 'Working with a Strength Coach?',                                                                                            
      type: 'select',                                                                                                                     
      category: 'Schedule',                                                                                                               
      audience: 'All',                                                                                                                    
      options: ['Yes - Private', 'Yes - Team Provided', 'No', 'Looking for one']                                                          
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'strength_coach',                                                                                                               
      label: 'Strength Coach Name',                                                                                                       
      type: 'text',                                                                                                                       
      category: 'Schedule',                                                                                                               
      audience: 'All',                                                                                                                    
      placeholder: 'Name (if applicable)'                                                                                                 
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'has_private_coach',                                                                                                            
      label: 'Private Pitching/Hitting Coach?',                                                                                           
      type: 'select',                                                                                                                     
      category: 'Schedule',                                                                                                               
      audience: 'All',                                                                                                                    
      options: ['Yes', 'No', 'Looking for one']                                                                                           
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'pitching_coach',                                                                                                               
      label: 'Coach Name',                                                                                                                
      type: 'text',                                                                                                                       
      category: 'Schedule',                                                                                                               
      audience: 'All',                                                                                                                    
      placeholder: 'Name (if applicable)'                                                                                                 
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'training_frequency',                                                                                                           
      label: 'Training Days Per Week',                                                                                                    
      type: 'select',                                                                                                                     
      category: 'Schedule',                                                                                                               
      audience: 'All',                                                                                                                    
      options: ['3 days', '4 days', '5 days', '6 days', '7 days']                                                                         
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'offseason_location',                                                                                                           
      label: 'Offseason Location',                                                                                                        
      type: 'text',                                                                                                                       
      category: 'Schedule',                                                                                                               
      audience: 'All',                                                                                                                    
      placeholder: 'City, State'                                                                                                          
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'has_mental_coach',                                                                                                             
      label: 'Mental Performance Coach?',                                                                                                 
      type: 'select',                                                                                                                     
      category: 'Schedule',                                                                                                               
      audience: 'All',                                                                                                                    
      options: ['Yes', 'No', 'Interested']                                                                                                
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'has_nutritionist',                                                                                                             
      label: 'Working with a Nutritionist?',                                                                                              
      type: 'select',                                                                                                                     
      category: 'Schedule',                                                                                                               
      audience: 'All',                                                                                                                    
      options: ['Yes', 'No', 'Interested']                                                                                                
    },                                                                                                                                    
                                                                                                                                          
    // HEALTH - Medical                                                                                                                   
    {                                                                                                                                     
      id: 'injury_history',                                                                                                               
      label: 'Any Past Surgeries?',                                                                                                       
      type: 'select',                                                                                                                     
      category: 'Medical',                                                                                                                
      audience: 'All',                                                                                                                    
      options: ['No surgeries', 'Tommy John (UCL)', 'Shoulder surgery', 'Knee surgery', 'Back surgery', 'Other surgery']                  
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'medical_history',                                                                                                              
      label: 'Medical History Details',                                                                                                   
      type: 'textarea',                                                                                                                   
      category: 'Medical',                                                                                                                
      audience: 'All',                                                                                                                    
      placeholder: 'Please provide any additional details about injuries, surgeries, or medical conditions...'                            
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'current_health_status',                                                                                                        
      label: 'Current Health Status',                                                                                                     
      type: 'select',                                                                                                                     
      category: 'Medical',                                                                                                                
      audience: 'All',                                                                                                                    
      options: ['100% healthy', 'Minor issue - playing through', 'Rehabbing injury', 'Recently cleared to play']                          
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'current_injuries',                                                                                                             
      label: 'Current Issues (if any)',                                                                                                   
      type: 'text',                                                                                                                       
      category: 'Medical',                                                                                                                
      audience: 'All',                                                                                                                    
      placeholder: 'Describe any current limitations'                                                                                     
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'has_pt',                                                                                                                       
      label: 'Working with PT/Athletic Trainer?',                                                                                         
      type: 'select',                                                                                                                     
      category: 'Medical',                                                                                                                
      audience: 'All',                                                                                                                    
      options: ['Yes - regularly', 'Yes - as needed', 'No', 'Team provided only']                                                         
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'allergies',                                                                                                                    
      label: 'Any Allergies?',                                                                                                            
      type: 'select',                                                                                                                     
      category: 'Medical',                                                                                                                
      audience: 'All',                                                                                                                    
      options: ['None', 'Food allergies', 'Medication allergies', 'Environmental', 'Multiple']                                            
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'allergy_details',                                                                                                              
      label: 'Allergy Details',                                                                                                           
      type: 'text',                                                                                                                       
      category: 'Medical',                                                                                                                
      audience: 'All',                                                                                                                    
      placeholder: 'Please specify (if applicable)'                                                                                       
    }                                                                                                                                     
  ]                                                                                                                                       
                                                                                                                                          
  // ============================================                                                                                         
  // FOUR PILLARS OPTIONS                                                                                                                 
  // ============================================                                                                                         
  const FOUR_PILLARS = [                                                                                                                  
    {                                                                                                                                     
      id: 'mental',                                                                                                                       
      label: 'Mental',                                                                                                                    
      description: 'Focus, confidence, game preparation',                                                                                 
      icon: Brain                                                                                                                         
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'physical',                                                                                                                     
      label: 'Physical',                                                                                                                  
      description: 'Strength, speed, conditioning',                                                                                       
      icon: Zap                                                                                                                           
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'technique',                                                                                                                    
      label: 'Technique',                                                                                                                 
      description: 'Mechanics, skill development',                                                                                        
      icon: Target                                                                                                                        
    },                                                                                                                                    
    {                                                                                                                                     
      id: 'nutrition',                                                                                                                    
      label: 'Nutrition & Recovery',                                                                                                      
      description: 'Diet, sleep, body maintenance',                                                                                       
      icon: Apple                                                                                                                         
    }                                                                                                                                     
  ]                                                                                                                                       
                                                                                                                                          
  // ============================================                                                                                         
  // SECTION CONFIGURATION                                                                                                                
  // ============================================                                                                                         
  const SECTIONS = {                                                                                                                      
    Biographical: {                                                                                                                       
      title: 'The Basics',                                                                                                                
      subtitle: "Let's start with who you are",                                                                                           
      icon: User                                                                                                                          
    },                                                                                                                                    
    Preferences: {                                                                                                                        
      title: 'The Setup',                                                                                                                 
      subtitle: 'Your gear, your way',                                                                                                    
      icon: Settings                                                                                                                      
    },                                                                                                                                    
    Schedule: {                                                                                                                           
      title: 'The Grind',                                                                                                                 
      subtitle: 'Where the work happens',                                                                                                 
      icon: Dumbbell                                                                                                                      
    },                                                                                                                                    
    Medical: {                                                                                                                            
      title: 'Health',                                                                                                                    
      subtitle: 'Keeping you on the field',                                                                                               
      icon: Heart                                                                                                                         
    }                                                                                                                                     
  }                                                                                                                                       
                                                                                                                                          
  // ============================================                                                                                         
  // TOAST COMPONENT                                                                                                                      
  // ============================================                                                                                         
  function Toast({ message, isVisible }) {                                                                                                
    if (!isVisible) return null                                                                                                           
                                                                                                                                          
    return (                                                                                                                              
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 toast-enter">                                                         
        <div className="bg-black text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">                                     
          <Check className="w-5 h-5 text-green-400" />                                                                                    
          <span className="font-medium">{message}</span>                                                                                  
        </div>                                                                                                                            
      </div>                                                                                                                              
    )                                                                                                                                     
  }                                                                                                                                       
                                                                                                                                          
  // ============================================                                                                                         
  // STATUS TOGGLE COMPONENT (Three-way)                                                                                                  
  // ============================================                                                                                         
  function StatusToggle({ status, setStatus }) {                                                                                          
    const statuses = [                                                                                                                    
      { id: 'highschool', label: 'High School', icon: School },                                                                           
      { id: 'college', label: 'College', icon: GraduationCap },                                                                           
      { id: 'pro', label: 'Professional', icon: Briefcase }                                                                               
    ]                                                                                                                                     
                                                                                                                                          
    return (                                                                                                                              
      <div className="mb-12">                                                                                                             
        <div className="text-center mb-6">                                                                                                
          <h2 className="text-2xl font-bold text-black mb-2">Where are you in your journey?</h2>                                          
          <p className="text-gray-500">Select your current status</p>                                                                     
        </div>                                                                                                                            
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">                                                         
          {statuses.map(({ id, label, icon: Icon }) => (                                                                                  
            <button                                                                                                                       
              key={id}                                                                                                                    
              onClick={() => setStatus(id)}                                                                                               
              className={`group flex items-center justify-center gap-3 px-6 py-4 rounded-lg border-2 transition-all duration-200 ${       
                status === id                                                                                                             
                  ? 'border-black bg-black text-white'                                                                                    
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'                                                        
              }`}                                                                                                                         
            >                                                                                                                             
              <Icon className={`w-5 h-5 ${status === id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />                  
              <span className="font-semibold">{label}</span>                                                                              
              {status === id && <ArrowRight className="w-4 h-4 ml-1" />}                                                                  
            </button>                                                                                                                     
          ))}                                                                                                                             
        </div>                                                                                                                            
      </div>                                                                                                                              
    )                                                                                                                                     
  }                                                                                                                                       
                                                                                                                                          
  // ============================================                                                                                         
  // FOUR PILLARS COMPONENT                                                                                                               
  // ============================================                                                                                         
  function FourPillarsSection({ selected, onChange }) {                                                                                   
    return (                                                                                                                              
      <div className="mb-12 border-t border-gray-100 pt-12">                                                                              
        <div className="text-center mb-8">                                                                                                
          <h2 className="text-2xl font-bold text-black mb-2">The Four Pillars</h2>                                                        
          <p className="text-gray-500">Where do you feel you need the most support? Select all that apply.</p>                            
        </div>                                                                                                                            
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">                                                            
          {FOUR_PILLARS.map(({ id, label, description, icon: Icon }) => {                                                                 
            const isSelected = selected.includes(id)                                                                                      
            return (                                                                                                                      
              <button                                                                                                                     
                key={id}                                                                                                                  
                onClick={() => {                                                                                                          
                  if (isSelected) {                                                                                                       
                    onChange(selected.filter(s => s !== id))                                                                              
                  } else {                                                                                                                
                    onChange([...selected, id])                                                                                           
                  }                                                                                                                       
                }}                                                                                                                        
                className={`group p-6 rounded-xl border-2 text-left transition-all duration-200 ${                                        
                  isSelected                                                                                                              
                    ? 'border-black bg-black text-white'                                                                                  
                    : 'border-gray-200 bg-white hover:border-gray-400'                                                                    
                }`}                                                                                                                       
              >                                                                                                                           
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${                                            
                  isSelected ? 'bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'                                                      
                }`}>                                                                                                                      
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />                                           
                </div>                                                                                                                    
                <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-white' : 'text-black'}`}>                                     
                  {label}                                                                                                                 
                </h3>                                                                                                                     
                <p className={`text-sm ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>                                               
                  {description}                                                                                                           
                </p>                                                                                                                      
                {isSelected && (                                                                                                          
                  <div className="mt-3 flex items-center gap-1 text-sm font-medium">                                                      
                    <Check className="w-4 h-4" />                                                                                         
                    Selected                                                                                                              
                  </div>                                                                                                                  
                )}                                                                                                                        
              </button>                                                                                                                   
            )                                                                                                                             
          })}                                                                                                                             
        </div>                                                                                                                            
      </div>                                                                                                                              
    )                                                                                                                                     
  }                                                                                                                                       
                                                                                                                                          
  // ============================================                                                                                         
  // FORM FIELD COMPONENT                                                                                                                 
  // ============================================                                                                                         
  function FormField({ field, value, onChange }) {                                                                                        
    const inputClasses = "w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none
   transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"                                                               
                                                                                                                                          
    return (                                                                                                                              
      <div className="space-y-2">                                                                                                         
        <label className="block text-sm font-semibold text-gray-900">                                                                     
          {field.label}                                                                                                                   
          {field.required && <span className="text-red-500 ml-1">*</span>}                                                                
        </label>                                                                                                                          
                                                                                                                                          
        {field.type === 'text' && (                                                                                                       
          <input                                                                                                                          
            type="text"                                                                                                                   
            value={value || ''}                                                                                                           
            onChange={(e) => onChange(field.id, e.target.value)}                                                                          
            placeholder={field.placeholder}                                                                                               
            className={inputClasses}                                                                                                      
          />                                                                                                                              
        )}                                                                                                                                
                                                                                                                                          
        {field.type === 'date' && (                                                                                                       
          <input                                                                                                                          
            type="date"                                                                                                                   
            value={value || ''}                                                                                                           
            onChange={(e) => onChange(field.id, e.target.value)}                                                                          
            className={inputClasses}                                                                                                      
          />                                                                                                                              
        )}                                                                                                                                
                                                                                                                                          
        {field.type === 'textarea' && (                                                                                                   
          <textarea                                                                                                                       
            value={value || ''}                                                                                                           
            onChange={(e) => onChange(field.id, e.target.value)}                                                                          
            placeholder={field.placeholder}                                                                                               
            rows={3}                                                                                                                      
            className={`${inputClasses} resize-none`}                                                                                     
          />                                                                                                                              
        )}                                                                                                                                
                                                                                                                                          
        {field.type === 'select' && (                                                                                                     
          <select                                                                                                                         
            value={value || ''}                                                                                                           
            onChange={(e) => onChange(field.id, e.target.value)}                                                                          
            className={inputClasses}                                                                                                      
          >                                                                                                                               
            <option value="">Select...</option>                                                                                           
            {field.options?.map((opt) => (                                                                                                
              <option key={opt} value={opt}>                                                                                              
                {opt}                                                                                                                     
              </option>                                                                                                                   
            ))}                                                                                                                           
          </select>                                                                                                                       
        )}                                                                                                                                
      </div>                                                                                                                              
    )                                                                                                                                     
  }                                                                                                                                       
                                                                                                                                          
  // ============================================                                                                                         
  // FORM SECTION COMPONENT                                                                                                               
  // ============================================                                                                                         
  function FormSection({ category, fields, formData, onChange }) {                                                                        
    const section = SECTIONS[category]                                                                                                    
    const Icon = section.icon                                                                                                             
                                                                                                                                          
    if (fields.length === 0) return null                                                                                                  
                                                                                                                                          
    return (                                                                                                                              
      <div className="mb-12 border-t border-gray-100 pt-12">                                                                              
        <div className="flex items-center gap-4 mb-8">                                                                                    
          <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center">                                                
            <Icon className="w-6 h-6 text-white" />                                                                                       
          </div>                                                                                                                          
          <div>                                                                                                                           
            <h2 className="text-2xl font-bold text-black">{section.title}</h2>                                                            
            <p className="text-gray-500">{section.subtitle}</p>                                                                           
          </div>                                                                                                                          
        </div>                                                                                                                            
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                                                                           
          {fields.map((field) => (                                                                                                        
            <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>                                             
              <FormField                                                                                                                  
                field={field}                                                                                                             
                value={formData[field.id]}                                                                                                
                onChange={onChange}                                                                                                       
              />                                                                                                                          
            </div>                                                                                                                        
          ))}                                                                                                                             
        </div>                                                                                                                            
      </div>                                                                                                                              
    )                                                                                                                                     
  }                                                                                                                                       
                                                                                                                                          
  // ============================================                                                                                         
  // CONSENT CHECKBOX COMPONENT                                                                                                           
  // ============================================                                                                                         
  function ConsentCheckbox({ checked, onChange }) {                                                                                       
    return (                                                                                                                              
      <div className="mb-12 border-t border-gray-100 pt-12">                                                                              
        <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">                                                                
          <div className="flex-shrink-0 mt-0.5">                                                                                          
            <input                                                                                                                        
              type="checkbox"                                                                                                             
              id="consent"                                                                                                                
              checked={checked}                                                                                                           
              onChange={(e) => onChange(e.target.checked)}                                                                                
              className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black cursor-pointer"                                      
            />                                                                                                                            
          </div>                                                                                                                          
          <div className="flex-1">                                                                                                        
            <label htmlFor="consent" className="block font-semibold text-black cursor-pointer">                                           
              Data Sharing Consent                                                                                                        
            </label>                                                                                                                      
            <p className="text-sm text-gray-600 mt-1">                                                                                    
              I consent to sharing my health and performance data with Stadium Ventures for development purposes.                         
              This information will be handled in accordance with our privacy policy and used solely to support                           
              my athletic career.                                                                                                         
            </p>                                                                                                                          
          </div>                                                                                                                          
          <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />                                                                      
        </div>                                                                                                                            
      </div>                                                                                                                              
    )                                                                                                                                     
  }                                                                                                                                       
                                                                                                                                          
  // ============================================                                                                                         
  // MAIN APP COMPONENT                                                                                                                   
  // ============================================                                                                                         
  function App() {                                                                                                                        
    const [playerStatus, setPlayerStatus] = useState('highschool')                                                                        
    const [formData, setFormData] = useState({})                                                                                          
    const [selectedPillars, setSelectedPillars] = useState([])                                                                            
    const [consent, setConsent] = useState(false)                                                                                         
    const [toast, setToast] = useState({ visible: false, message: '' })                                                                   
    const [isSubmitting, setIsSubmitting] = useState(false)                                                                               
    const [isSubmitted, setIsSubmitted] = useState(false)                                                                                 
                                                                                                                                          
    // Filter fields based on player status                                                                                               
    const getVisibleFields = useCallback(() => {                                                                                          
      return DEFAULT_FORM_CONFIG.filter((field) => {                                                                                      
        if (field.audience === 'All') return true                                                                                         
        if (playerStatus === 'highschool' && field.audience === 'HighSchool') return true                                                 
        if (playerStatus === 'college' && field.audience === 'College') return true                                                       
        if (playerStatus === 'pro' && field.audience === 'Pro') return true                                                               
        return false                                                                                                                      
      })                                                                                                                                  
    }, [playerStatus])                                                                                                                    
                                                                                                                                          
    // Group fields by category                                                                                                           
    const getFieldsByCategory = useCallback(() => {                                                                                       
      const visible = getVisibleFields()                                                                                                  
      const grouped = {                                                                                                                   
        Biographical: [],                                                                                                                 
        Preferences: [],                                                                                                                  
        Schedule: [],                                                                                                                     
        Medical: []                                                                                                                       
      }                                                                                                                                   
      visible.forEach((field) => {                                                                                                        
        if (grouped[field.category]) {                                                                                                    
          grouped[field.category].push(field)                                                                                             
        }                                                                                                                                 
      })                                                                                                                                  
      return grouped                                                                                                                      
    }, [getVisibleFields])                                                                                                                
                                                                                                                                          
    // Handle form field changes                                                                                                          
    const handleFieldChange = (fieldId, value) => {                                                                                       
      setFormData((prev) => ({                                                                                                            
        ...prev,                                                                                                                          
        [fieldId]: value                                                                                                                  
      }))                                                                                                                                 
    }                                                                                                                                     
                                                                                                                                          
    // Show toast notification                                                                                                            
    const showToast = (message) => {                                                                                                      
      setToast({ visible: true, message })                                                                                                
      setTimeout(() => {                                                                                                                  
        setToast({ visible: false, message: '' })                                                                                         
      }, 4000)                                                                                                                            
    }                                                                                                                                     
                                                                                                                                          
    // Get status label                                                                                                                   
    const getStatusLabel = () => {                                                                                                        
      switch (playerStatus) {                                                                                                             
        case 'highschool': return 'High School'                                                                                           
        case 'college': return 'College'                                                                                                  
        case 'pro': return 'Professional'                                                                                                 
        default: return playerStatus                                                                                                      
      }                                                                                                                                   
    }                                                                                                                                     
                                                                                                                                          
    // Generate human-readable summary                                                                                                    
    const generateSummary = () => {                                                                                                       
      const visibleFields = getVisibleFields()                                                                                            
      let summary = '='.repeat(50) + '\n'                                                                                                 
      summary += 'STADIUM VENTURES - PRE-ONBOARDING DOSSIER\n'                                                                            
      summary += '='.repeat(50) + '\n\n'                                                                                                  
      summary += `Player Type: ${getStatusLabel()}\n`                                                                                     
      summary += `Generated: ${new Date().toLocaleDateString('en-US', {                                                                   
        weekday: 'long',                                                                                                                  
        year: 'numeric',                                                                                                                  
        month: 'long',                                                                                                                    
        day: 'numeric'                                                                                                                    
      })}\n\n`                                                                                                                            
                                                                                                                                          
      const categories = ['Biographical', 'Preferences', 'Schedule', 'Medical']                                                           
      categories.forEach((category) => {                                                                                                  
        const sectionFields = visibleFields.filter((f) => f.category === category)                                                        
        if (sectionFields.length === 0) return                                                                                            
                                                                                                                                          
        summary += `----- ${SECTIONS[category].title.toUpperCase()} -----\n`                                                              
        sectionFields.forEach((field) => {                                                                                                
          const value = formData[field.id] || '(not provided)'                                                                            
          summary += `${field.label}: ${value}\n`                                                                                         
        })                                                                                                                                
        summary += '\n'                                                                                                                   
      })                                                                                                                                  
                                                                                                                                          
      // Add Four Pillars                                                                                                                 
      summary += `----- FOUR PILLARS (Areas for Support) -----\n`                                                                         
      if (selectedPillars.length > 0) {                                                                                                   
        selectedPillars.forEach((pillarId) => {                                                                                           
          const pillar = FOUR_PILLARS.find(p => p.id === pillarId)                                                                        
          if (pillar) {                                                                                                                   
            summary += `- ${pillar.label}: ${pillar.description}\n`                                                                       
          }                                                                                                                               
        })                                                                                                                                
      } else {                                                                                                                            
        summary += '(none selected)\n'                                                                                                    
      }                                                                                                                                   
      summary += '\n'                                                                                                                     
                                                                                                                                          
      summary += `Data Consent: ${consent ? 'YES - Agreed' : 'NO - Not agreed'}\n`                                                        
                                                                                                                                          
      return summary                                                                                                                      
    }                                                                                                                                     
                                                                                                                                          
    // Generate CSV data                                                                                                                  
    const generateCSV = () => {                                                                                                           
      const visibleFields = getVisibleFields()                                                                                            
      const csvData = {}                                                                                                                  
                                                                                                                                          
      csvData['_player_type'] = playerStatus                                                                                              
      csvData['_generated_date'] = new Date().toISOString()                                                                               
      csvData['_consent_given'] = consent ? 'yes' : 'no'                                                                                  
      csvData['_four_pillars'] = selectedPillars.join(';')                                                                                
                                                                                                                                          
      visibleFields.forEach((field) => {                                                                                                  
        csvData[field.id] = formData[field.id] || ''                                                                                      
      })                                                                                                                                  
                                                                                                                                          
      return Papa.unparse([csvData])                                                                                                      
    }                                                                                                                                     
                                                                                                                                          
    // Handle form submission                                                                                                             
    const handleSubmit = async () => {                                                                                                    
      // Check for required fields                                                                                                        
      const visibleFields = getVisibleFields()                                                                                            
      const missingRequired = visibleFields                                                                                               
        .filter((f) => f.required && !formData[f.id])                                                                                     
        .map((f) => f.label)                                                                                                              
                                                                                                                                          
      if (missingRequired.length > 0) {                                                                                                   
        showToast(`Please fill in: ${missingRequired[0]}`)                                                                                
        return                                                                                                                            
      }                                                                                                                                   
                                                                                                                                          
      if (!consent) {                                                                                                                     
        showToast('Please accept the data sharing consent')                                                                               
        return                                                                                                                            
      }                                                                                                                                   
                                                                                                                                          
      setIsSubmitting(true)                                                                                                               
                                                                                                                                          
      // Generate the full package                                                                                                        
      const summary = generateSummary()                                                                                                   
      const csv = generateCSV()                                                                                                           
      const playerName = formData.full_name || 'New Player'                                                                               
                                                                                                                                          
      // Prepare submission data                                                                                                          
      const submissionData = {                                                                                                            
        _subject: `New Onboarding Dossier: ${playerName}`,                                                                                
        player_name: playerName,                                                                                                          
        player_type: getStatusLabel(),                                                                                                    
        email: formData.email || '',                                                                                                      
        phone: formData.phone || '',                                                                                                      
        four_pillars: selectedPillars.map(id => {                                                                                         
          const pillar = FOUR_PILLARS.find(p => p.id === id)                                                                              
          return pillar ? pillar.label : id                                                                                               
        }).join(', ') || 'None selected',                                                                                                 
        dossier_summary: summary,                                                                                                         
        csv_data: csv                                                                                                                     
      }                                                                                                                                   
                                                                                                                                          
      try {                                                                                                                               
        const response = await fetch(FORMSPREE_ENDPOINT, {                                                                                
          method: 'POST',                                                                                                                 
          headers: {                                                                                                                      
            'Content-Type': 'application/json',                                                                                           
            'Accept': 'application/json'                                                                                                  
          },                                                                                                                              
          body: JSON.stringify(submissionData)                                                                                            
        })                                                                                                                                
                                                                                                                                          
        if (response.ok) {                                                                                                                
          setIsSubmitted(true)                                                                                                            
        } else {                                                                                                                          
          throw new Error('Submission failed')                                                                                            
        }                                                                                                                                 
      } catch (err) {                                                                                                                     
        console.error('Submission error:', err)                                                                                           
        showToast('Submission failed. Please try again.')                                                                                 
      } finally {                                                                                                                         
        setIsSubmitting(false)                                                                                                            
      }                                                                                                                                   
    }                                                                                                                                     
                                                                                                                                          
    const fieldsByCategory = getFieldsByCategory()                                                                                        
                                                                                                                                          
    // Success Screen                                                                                                                     
    if (isSubmitted) {                                                                                                                    
      return (                                                                                                                            
        <div className="min-h-screen bg-white flex items-center justify-center">                                                          
          <div className="max-w-md mx-auto px-4 text-center">                                                                             
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">                           
              <CheckCircle className="w-10 h-10 text-green-600" />                                                                        
            </div>                                                                                                                        
            <h1 className="text-3xl font-bold text-black mb-4">You're All Set!</h1>                                                       
            <p className="text-gray-500 text-lg mb-8">                                                                                    
              Your dossier has been submitted to the Stadium Ventures team.                                                               
              We'll be in touch soon to discuss your journey.                                                                             
            </p>                                                                                                                          
            <p className="text-sm text-gray-400">                                                                                         
              A confirmation has been sent to {formData.email || 'your email'}.                                                           
            </p>                                                                                                                          
          </div>                                                                                                                          
        </div>                                                                                                                            
      )                                                                                                                                   
    }                                                                                                                                     
                                                                                                                                          
    return (                                                                                                                              
      <div className="min-h-screen bg-white">                                                                                             
        {/* Header */}                                                                                                                    
        <header className="border-b border-gray-100">                                                                                     
          <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">                                                                   
            <div className="flex items-center justify-between">                                                                           
              <h1 className="text-xl font-bold text-black tracking-tight">Stadium Ventures</h1>                                           
              <span className="text-sm text-gray-500">Pre-Onboarding Dossier</span>                                                       
            </div>                                                                                                                        
          </div>                                                                                                                          
        </header>                                                                                                                         
                                                                                                                                          
        {/* Hero Section */}                                                                                                              
        <div className="border-b border-gray-100">                                                                                        
          <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">                                                                  
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6 leading-tight">                                                 
              A Higher Standard<br />Starts Here                                                                                          
            </h2>                                                                                                                         
            <p className="text-xl text-gray-500 max-w-2xl">                                                                               
              Welcome to Stadium Ventures. This dossier helps us understand who you are,                                                  
              so we can build a plan that fits your journey.                                                                              
            </p>                                                                                                                          
          </div>                                                                                                                          
        </div>                                                                                                                            
                                                                                                                                          
        {/* Main Content */}                                                                                                              
        <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">                                                                   
          {/* Status Toggle */}                                                                                                           
          <StatusToggle status={playerStatus} setStatus={setPlayerStatus} />                                                              
                                                                                                                                          
          {/* Form Sections */}                                                                                                           
          {Object.entries(fieldsByCategory).map(([category, fields]) => (                                                                 
            <FormSection                                                                                                                  
              key={category}                                                                                                              
              category={category}                                                                                                         
              fields={fields}                                                                                                             
              formData={formData}                                                                                                         
              onChange={handleFieldChange}                                                                                                
            />                                                                                                                            
          ))}                                                                                                                             
                                                                                                                                          
          {/* Four Pillars Section */}                                                                                                    
          <FourPillarsSection                                                                                                             
            selected={selectedPillars}                                                                                                    
            onChange={setSelectedPillars}                                                                                                 
          />                                                                                                                              
                                                                                                                                          
          {/* Consent Checkbox */}                                                                                                        
          <ConsentCheckbox checked={consent} onChange={setConsent} />                                                                     
                                                                                                                                          
          {/* Submit Button */}                                                                                                           
          <div className="flex justify-center pb-12">                                                                                     
            <button                                                                                                                       
              onClick={handleSubmit}                                                                                                      
              disabled={isSubmitting}                                                                                                     
              className="group bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold px-8 py-4 rounded-lg              
  transition-all duration-200 flex items-center gap-3"                                                                                    
            >                                                                                                                             
              {isSubmitting ? (                                                                                                           
                <>                                                                                                                        
                  <Loader2 className="w-5 h-5 animate-spin" />                                                                            
                  Submitting...                                                                                                           
                </>                                                                                                                       
              ) : (                                                                                                                       
                <>                                                                                                                        
                  <Send className="w-5 h-5" />                                                                                            
                  Submit Dossier                                                                                                          
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />                                       
                </>                                                                                                                       
              )}                                                                                                                          
            </button>                                                                                                                     
          </div>                                                                                                                          
                                                                                                                                          
          {/* Footer Note */}                                                                                                             
          <div className="text-center text-gray-400 text-sm pb-8 border-t border-gray-100 pt-8">                                          
            <p className="flex items-center justify-center gap-2">                                                                        
              <Shield className="w-4 h-4" />                                                                                              
              Your information is secure and handled with care.                                                                           
            </p>                                                                                                                          
          </div>                                                                                                                          
        </main>                                                                                                                           
                                                                                                                                          
        {/* Toast Notification */}                                                                                                        
        <Toast                                                                                                                            
          message={toast.message}                                                                                                         
          isVisible={toast.visible}                                                                                                       
        />                                                                                                                                
      </div>                                                                                                                              
    )                                                                                                                                     
  }                                                                                                                                       
                                                                                                                                          
  export default App 
